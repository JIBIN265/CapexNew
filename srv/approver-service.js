const cds = require("@sap/cds");
const { SELECT, INSERT, UPDATE } = cds.ql;
const SequenceHelper = require("./lib/SequenceHelper");
const defaults = require("dotenv").config({
    path: "./srv/defaults/sap-defaults.env",
});

class CapexApproverCatalogService extends cds.ApplicationService {
    async init() {
        const {
            Capex,
            CashFlowYear,
            ApproverHistory,
            Comments,
            Sustainability2030,
            Cot001Set,
            OrderTypeF4Set,
            BusinessReasonF4Set,
            DivisionF4Set,
            SiteF4Set,
            MasterDataSet,
            CurrencyF4Set,
            ApproverLevelsSet,
            UserRolesSet
        } = this.entities;

        const db = await cds.connect.to("db");

        const ecc = await cds.connect.to('ZODATA_INTERNAL_ORDER_SRV');

        this.on('READ', [Cot001Set, OrderTypeF4Set, BusinessReasonF4Set,
            DivisionF4Set, SiteF4Set, CurrencyF4Set, MasterDataSet,
            UserRolesSet, ApproverLevelsSet], async req => {
                return ecc.run(req.query);

            });

        this.before('READ', Capex, async (req) => {

            try {
                // Add a filter to fetch only records created by the current user
                req.query.where({ currentApprover: 'jibin.thomas@msitek.us' });

                // Execute the query to check for records
                const results = await cds.run(req.query);

            } catch (error) {
                // Handle errors gracefully
                req.reject(500, `An error occurred: ${error.message}`);
            }

        });


        this.before('DELETE', Capex, async (req) => {
            debugger;
            const currentRecord = await db.run(
                SELECT.from(Capex)
                    .columns(cpx => {
                        cpx`*`
                    })
                    .where({ ID: req.data.ID })
            );
            if (currentRecord[0].createdBy !== req.user.id) {
                req.error(400, 'You are not Allowed to delete the Order');
                return;
            }
        });

        this.before('READ', ApproverHistory, async (req) => {

            try {
                const allRecords = await db.run(
                    SELECT.from(Capex)
                        .columns(cpx => {
                            cpx`*`,
                                cpx.to_ApproverHistory(cfy => { cfy`*` });
                        })
                        .where({
                            ID: req.data.up__ID
                        })
                );


                for (let capex of allRecords) {

                    // Update each `to_ApproverHistory` record's `days` field if status is "Pending"
                    for (let history of capex.to_ApproverHistory) {
                        if (history.status === 'Pending' && history.pendingDate) {
                            const days = Math.ceil((new Date() - new Date(history.pendingDate)) / (1000 * 60 * 60 * 24));
                            if (days && history.days !== days) {
                                history.days = days; // Update only if different
                                let updateHistory = await db.run(
                                    UPDATE(ApproverHistory)
                                        .set({ days: days.toString() })
                                        .where({ up__ID: req.data.up__ID, ID: history.ID }))
                            }

                        }
                    }
                }

            } catch (error) {
                console.error('Error during synchronization:', error);
                return req.error(500, error.message);
            }
        });

        async function statusChange(req, ID, newStatus) {
            try {
                const updatedDbRecord = await db.run(
                    UPDATE(Capex)
                        .set({ status: newStatus })
                        .where({ ID: ID })
                );

                if (!updatedDbRecord) {
                    return req.error(404, `Record with ID ${ID} not found in the local DB.`);
                }

                const record = await db.run(SELECT.one.from(Capex).where({ ID: ID }));
                const eccPayload = {
                    orderNumber: record.orderNumber,
                    status: newStatus,
                };

                let successData = null;
                let updateQuery = INSERT.into('ChangeStatusSet', [eccPayload])

                let result = await ecc.tx(req).run(updateQuery)
                successData = result;
                req.data.status = successData.status;
                req.notify(`Status updated to ${newStatus} for order ${record.orderNumber} in both DB and ECC`);
                let finalReturn = {
                    orderNumber: record.orderNumber,
                    status: "Success",
                }
                return req.reply(finalReturn);

            } catch (error) {
                if (error.code) {
                    let errorMessage = error.message || "An exception was raised.";

                    // Extract more detailed error information if available
                    if (error.innerError && error.innerError.errordetails) {
                        error.innerError.errordetails.forEach(detail => {
                            errorMessage += `\n${detail.code}: ${detail.message}`;
                        });
                    }
                    let finalReturn = {
                        orderNumber: errorMessage,
                        status: "Error",
                    }
                    return req.reply(finalReturn);
                } else {
                    let errorMessage = "An unexpected error occurred";
                    let finalReturn = {
                        orderNumber: errorMessage,
                        status: "Error",
                    }
                    return req.reply(finalReturn);
                }
            }
        }

        async function approveChange(req, Status, wfComments) {
            const wf_parentId = req.params[0];
            const wf_status = Status;
            try {
                const currentRecord = await db.run(
                    SELECT.from(Capex)
                        .columns(cpx => {
                            cpx`*`,
                                cpx.to_ApproverHistory(cfy => { cfy`*` }),
                                cpx.attachments(atch => { atch`*` }),
                                cpx.to_Comments(cmt => { cmt`*` })
                        })
                        .where({ ID: wf_parentId })
                );

                if (!currentRecord[0].currentApprover) {
                    req.error(404, 'Capex Order Approval Already Completed!');
                }
                if (req.errors) { req.reject(); }
                let wf_instanceID;
                if (wfComments) {
                    const newComment = {
                        up__ID: wf_parentId,
                        text: wfComments
                    };
                    try {
                        const insertedComment = await db.run(
                            INSERT.into(Comments).entries(newComment)
                        );
                    } catch (error) {
                        console.error("Error Inserting Feed:", error);
                    }

                }
                const wf_childId = currentRecord[0]?.to_ApproverHistory?.find(record => record.status === 'Pending')?.ID;
                wf_instanceID = currentRecord[0]?.to_ApproverHistory?.find(record => record.status === 'Pending')?.instanceId;
                if (wf_status === 'Approved' || wf_status === 'Skipped') {
                    let count;
                    if (wf_status === 'Approved') {
                        count = currentRecord[0].approvedCount + 1;
                    } else if (wf_status === 'Skipped') {
                        count = currentRecord[0].approvedCount;

                    }
                    const updatedApproverHistory = await db.run(
                        UPDATE(ApproverHistory)
                            .set({
                                status: wf_status
                            })
                            .where({ up__ID: wf_parentId, ID: wf_childId })
                    );

                    let lowestLevelEmail;
                    let lowestLevelID;
                    let lowestFolderID;
                    let dynamicURL;
                    let lowestName;
                    let lowestApprover;


                    let filteredApproverHistory = (currentRecord[0] && currentRecord[0].to_ApproverHistory)
                        ? currentRecord[0].to_ApproverHistory.filter(history => history.status === 'Not initiated')
                        : [];

                    if (filteredApproverHistory.length === 0) {
                        filteredApproverHistory = currentRecord[0].to_ApproverHistory.filter(history => history.status === 'Skipped');
                    }

                    if (filteredApproverHistory.length > 0) {
                        const sortedApprovers = filteredApproverHistory.sort((a, b) => a.Level - b.Level);
                        lowestLevelEmail = sortedApprovers[0]?.email
                        lowestLevelID = sortedApprovers[0]?.ID;
                        lowestFolderID = currentRecord[0]?.attachments?.[0]?.folderId || null;
                        const baseURL = "https://yk2lt6xsylvfx4dz.launchpad.cfapps.us10.hana.ondemand.com/site/Kruger#zcapexapprover-manage?sap-ui-app-id-hint=saas_approuter_zcapexapprover&/Capex({documentID})?layout=TwoColumnsMidExpanded";
                        dynamicURL = baseURL.replace("{documentID}", currentRecord[0]?.ID);
                        const userURL = "https://yk2lt6xsylvfx4dz.launchpad.cfapps.us10.hana.ondemand.com/site?siteId=4bf2f916-b150-4361-918c-8a51f5b9c835#zcapexcreator-manage?sap-ui-app-id-hint=saas_approuter_zcapexcreator&/Capex({documentID})?layout=TwoColumnsMidExpanded";
                        const dyuserURL = userURL.replace("{documentID}", currentRecord[0]?.documentID);
                        if (wf_status === 'Approved') {
                            lowestName = currentRecord[0].to_ApproverHistory[0].approverName;
                        } else if (wf_status === 'Skipped') {
                            lowestName = sortedApprovers[0].approverName;
                            wf_instanceID = sortedApprovers[0].instanceId;
                        }

                        let updateParent = await db.run(
                            UPDATE(Capex)
                                .set({
                                    approvedCount: count,
                                    currentApprover: lowestLevelEmail
                                })
                                .where({ ID: wf_parentId }))

                        const updatedApproverHistory1 = await db.run(
                            UPDATE(ApproverHistory)
                                .set({
                                    status: 'Pending',
                                    days: '1',
                                    pendingDate: new Date().toISOString()
                                })
                                .where({ up__ID: wf_parentId, ID: lowestLevelID })
                        );
                        if (wf_status === 'Approved') {
                            const newStatus = currentRecord[0].to_ApproverHistory[0].estat;//"E0010";
                            await statusChange(req, wf_parentId, newStatus);
                        }

                    } else {
                        return {
                            response: 'Workflow ended'
                        };
                    }

                    let testData = {
                        "definitionId": "us10.yk2lt6xsylvfx4dz.zcapexworkflow.triggerWorkflow",
                        "context": {
                            "orderNumber": currentRecord[0].orderNumber ? String(currentRecord[0].orderNumber) : "null",
                            "orderType": currentRecord[0].orderType ? String(currentRecord[0].orderType) : "null",
                            "companyCode": currentRecord[0].companyCode ? String(currentRecord[0].companyCode) : "null",
                            "site": currentRecord[0].site ? String(currentRecord[0].site) : "null",
                            "division": currentRecord[0].division ? String(currentRecord[0].division) : "null",
                            "description": currentRecord[0].description ? String(currentRecord[0].description) : "null",
                            "businessReasons": currentRecord[0].businessReason ? currentRecord[0].businessReason : "null",
                            "amount": currentRecord[0].amount ? String(currentRecord[0].amount) : "null",
                            "currency": currentRecord[0].currency_code ? currentRecord[0].currency_code : "null",
                            "appropriationsCosts": [
                                {
                                    "millLabor": currentRecord[0].millLabor ? String(currentRecord[0].millLabor) : "null",
                                    "maintenanceLabor": currentRecord[0].maintenanceLabor ? String(currentRecord[0].maintenanceLabor) : "null",
                                    "operationsLabor": currentRecord[0].operationsLabor ? String(currentRecord[0].operationsLabor) : "null",
                                    "outsideContract": currentRecord[0].outsideContract ? String(currentRecord[0].outsideContract) : "null",
                                    "materialCost": currentRecord[0].materialCost ? String(currentRecord[0].materialCost) : "null",
                                    "hardwareCost": currentRecord[0].hardwareCost ? String(currentRecord[0].hardwareCost) : "null",
                                    "softwareCost": currentRecord[0].softwareCost ? String(currentRecord[0].softwareCost) : "null",
                                    "contingencyCost": currentRecord[0].contingencyCost ? String(currentRecord[0].contingencyCost) : "null",
                                    "totalCost": currentRecord[0].totalCost ? String(currentRecord[0].totalCost) : "null"
                                }
                            ],
                            "approver": lowestLevelEmail,
                            "_id": currentRecord[0].ID ? String(currentRecord[0].ID) : "null",
                            "childId": lowestLevelID ? String(lowestLevelID) : "null",
                            "folderId": lowestFolderID ? String(lowestFolderID) : "null",
                            "url": dynamicURL ? String(dynamicURL) : "null",
                            "approverName": lowestName ? String(lowestName) : "null",
                            "initiator": req.user.id,
                            "initiatorName": req.user.id,
                            "userUrl": dyuserURL ? String(dynamicURL) : "null",
                            "action": "Create",
                            "decision": "",
                            "appComments": ""

                        }
                    };

                    let BPA_WORKFLOW = await cds.connect.to('BPA_WORKFLOW');

                    let response = await BPA_WORKFLOW.send('POST', '/', testData);

                    const updatedApproverHistory1 = await db.run(
                        UPDATE(ApproverHistory)
                            .set({
                                instanceId: response.rootInstanceId
                            })
                            .where({ up__ID: currentRecord[0].ID, ID: lowestLevelID })
                    )

                    let deletePayload = [
                        {
                            id: wf_instanceID, // ID of the workflow instance to delete
                            deleted: true           // Mark it for deletion
                        }
                    ];

                    try {
                        // Send the PATCH request
                        let deleteResponse = await BPA_WORKFLOW.send('PATCH', '/', deletePayload);

                        console.log("Workflow instance deleted successfully:", deleteResponse);
                    } catch (error) {
                        console.error("Error deleting workflow instance:", error);
                    }

                    //for sending mail to initiator:
                    testData.context.decision = Status; // Replace with your logic
                    testData.context.appComments = wfComments;
                    let responseMail = await BPA_WORKFLOW.send('POST', '/', testData);

                    return {
                        response: `${response} ${lowestLevelID} 'Workflow Triggered'`
                    };
                } else if (wf_status === 'Rejected') {
                    const updatedApproverHistory = await db.run(
                        UPDATE(ApproverHistory)
                            .set({
                                status: wf_status,
                                days: 0
                                // comments: wf_comments
                            })
                            .where({ up__ID: wf_parentId, ID: wf_childId })
                    );

                    let deletePayload = [
                        {
                            id: wf_instanceID, // ID of the workflow instance to delete
                            deleted: true           // Mark it for deletion
                        }
                    ];

                    try {
                        // Send the PATCH request
                        let deleteResponse = await BPA_WORKFLOW.send('PATCH', '/', deletePayload);

                        console.log("Workflow instance deleted successfully:", deleteResponse);
                    } catch (error) {
                        console.error("Error deleting workflow instance:", error);
                    }

                    const newStatus = "E0010";
                    await statusChange(req, wf_parentId, newStatus);
                    return {
                        response: 'Workflow Triggered Rejected'
                    };
                }

            } catch (error) {
                return {
                    response: `Status update failed: ${error.message}`
                }
            }
        }


        this.on("approve", async (req) => {
            // const { ID } = req.params[0];
            const Status = 'Approved';
            await approveChange(req, Status);
            // const newStatus = "E0009";
            // await statusChange(req, ID, newStatus);
        });


        this.on("rejectFinal2", async req => {
            const Comments = req.data.text;
            if (!Comments || Comments.trim() === '') {
                req.error(400, 'The "Reason for Rejection" field is mandatory.');
                return;
            }
            const Status = 'Rejected';
            await approveChange(req, Status, Comments);
        });

        this.on("validate", async req => {
            const Comments = req.data.text
            if (!Comments || Comments.trim() === '') {
                req.error(400, 'The "Reason for Skipping" field is mandatory.');
                return;
            }
            const Status = 'Skipped';
            await approveChange(req, Status, Comments);
        });


        this.on("rejectIncomplete", async (req) => {
            if (!Comments || Comments.trim() === '') {
                req.error(400, 'The "Reason for Rework" field is mandatory.');
                return;
            }
            const Comments = req.data.text
            const Status = 'Rework';
            await approveChange(req, Status, Comments);
        });


        this.on("workflow", async (req) => {
            const wf_parentId = req.params[0].ID;
            const wf_childId = req.data.childId;
            const wf_status = req.data.status;
            const wf_comments = req.data.comments;
            try {
                if (wf_status === 'Approved' || wf_status === 'Skipped') {
                    const updatedApproverHistory = await db.run(
                        UPDATE(ApproverHistory)
                            .set({
                                status: wf_status,
                                // comments: wf_comments
                            })
                            .where({ up__ID: wf_parentId, ID: wf_childId })
                    );

                    if (wf_comments) {
                        const newComment = {
                            up__ID: wf_parentId,
                            text: wf_comments
                        };

                        const insertedComment = await db.run(
                            INSERT.into(Comments).entries(newComment)
                        );
                    }


                    const currentRecord = await db.run(
                        SELECT.from(Capex)
                            .columns(cpx => {
                                cpx`*`,
                                    cpx.to_ApproverHistory(cfy => { cfy`*` }),
                                    cpx.attachments(atch => { atch`*` })
                            })
                            .where({ ID: wf_parentId })
                    );

                    let lowestLevelEmail;
                    let lowestLevelID;
                    let lowestFolderID;
                    let dynamicURL;
                    let lowestName;

                    let filteredApproverHistory = (currentRecord[0] && currentRecord[0].to_ApproverHistory)
                        ? currentRecord[0].to_ApproverHistory.filter(history => history.status === 'Not initiated')
                        : [];

                    if (filteredApproverHistory.length === 0) {
                        filteredApproverHistory = currentRecord[0].to_ApproverHistory.filter(history => history.status === 'Skipped');
                    }

                    if (filteredApproverHistory.length > 0) {
                        const sortedApprovers = filteredApproverHistory.sort((a, b) => a.Level - b.Level);
                        lowestLevelEmail = sortedApprovers[0]?.email;
                        lowestLevelID = sortedApprovers[0]?.ID;
                        lowestFolderID = currentRecord[0]?.attachments?.[0]?.folderId || null;
                        const baseURL = "https://yk2lt6xsylvfx4dz.launchpad.cfapps.us10.hana.ondemand.com/site/Kruger#zcapexapprover-manage?sap-ui-app-id-hint=saas_approuter_zcapexapprover&/Capex({documentID})?layout=TwoColumnsMidExpanded";
                        dynamicURL = baseURL.replace("{documentID}", currentRecord[0]?.ID);
                        if (wf_status === 'Approved') {
                            lowestName = currentRecord[0].to_ApproverHistory[0].approverName;
                        } else if (wf_status === 'Skipped') {
                            lowestName = sortedApprovers[0].approverName;
                        }

                        const lowestApprover = 'jibin.thomas@msitek.us';//currentRecord[0]?.attachments?.[0]?.email
                        const updateMain = await UPDATE(Capex)
                            .set({ currentApprover: lowestApprover })
                            .where({ ID: wf_parentId });

                        if (wf_status === 'Approved') {
                            const newStatus = currentRecord[0].to_ApproverHistory[0].estat;//"E0010";
                            await statusChange(req, wf_parentId, newStatus);
                        }


                        const updatedApproverHistory1 = await db.run(
                            UPDATE(ApproverHistory)
                                .set({
                                    status: 'Pending',
                                    days: '1',
                                    pendingDate: new Date().toISOString()
                                })
                                .where({ up__ID: wf_parentId, ID: lowestLevelID })
                        );

                    } else {
                        return {
                            response: 'Workflow ended'
                        };
                    }

                    let testData = {
                        "definitionId": "us10.yk2lt6xsylvfx4dz.zcapexworkflow.triggerWorkflow",
                        "context": {
                            "orderNumber": currentRecord[0].orderNumber ? String(currentRecord[0].orderNumber) : "null",
                            "orderType": currentRecord[0].orderType ? String(currentRecord[0].orderType) : "null",
                            "companyCode": currentRecord[0].companyCode ? String(currentRecord[0].companyCode) : "null",
                            "site": currentRecord[0].site ? String(currentRecord[0].site) : "null",
                            "division": currentRecord[0].division ? String(currentRecord[0].division) : "null",
                            "description": currentRecord[0].description ? String(currentRecord[0].description) : "null",
                            "businessReasons": currentRecord[0].businessReason ? currentRecord[0].businessReason : "null",
                            "amount": currentRecord[0].amount ? String(currentRecord[0].amount) : "null",
                            "currency": currentRecord[0].currency_code ? currentRecord[0].currency_code : "null",
                            "appropriationsCosts": [
                                {
                                    "millLabor": currentRecord[0].millLabor ? String(currentRecord[0].millLabor) : "null",
                                    "maintenanceLabor": currentRecord[0].maintenanceLabor ? String(currentRecord[0].maintenanceLabor) : "null",
                                    "operationsLabor": currentRecord[0].operationsLabor ? String(currentRecord[0].operationsLabor) : "null",
                                    "outsideContract": currentRecord[0].outsideContract ? String(currentRecord[0].outsideContract) : "null",
                                    "materialCost": currentRecord[0].materialCost ? String(currentRecord[0].materialCost) : "null",
                                    "hardwareCost": currentRecord[0].hardwareCost ? String(currentRecord[0].hardwareCost) : "null",
                                    "softwareCost": currentRecord[0].softwareCost ? String(currentRecord[0].softwareCost) : "null",
                                    "contingencyCost": currentRecord[0].contingencyCost ? String(currentRecord[0].contingencyCost) : "null",
                                    "totalCost": currentRecord[0].totalCost ? String(currentRecord[0].totalCost) : "null"
                                }
                            ],
                            "approver": lowestLevelEmail,
                            "_id": currentRecord[0].ID ? String(currentRecord[0].ID) : "null",
                            "childId": lowestLevelID ? String(lowestLevelID) : "null",
                            "folderId": lowestFolderID ? String(lowestFolderID) : "null",
                            "url": dynamicURL ? String(dynamicURL) : "null",
                            "approverName": lowestName ? String(lowestName) : "null",
                            "initiator": req.user.id,
                            "initiatorName": req.user.id
                        }
                    };

                    let BPA_WORKFLOW = await cds.connect.to('BPA_WORKFLOW');

                    let response = await BPA_WORKFLOW.send('POST', '/', testData);

                    const updatedApproverHistory1 = await db.run(
                        UPDATE(ApproverHistory)
                            .set({
                                instanceId: response.rootInstanceId
                            })
                            .where({ up__ID: currentRecord[0].ID, ID: lowestLevelID })
                    )

                    return {
                        response: `${response} ${lowestLevelID} 'Workflow Triggered'`
                    };
                } else if (wf_status === 'Rejected') {
                    const updatedApproverHistory = await db.run(
                        UPDATE(ApproverHistory)
                            .set({
                                status: wf_status,
                                comments: wf_comments
                            })
                            .where({ up__ID: wf_parentId, ID: wf_childId })
                    );
                    const newStatus = "E0010";
                    await statusChange(req, wf_parentId, newStatus);
                    return {
                        response: 'Workflow Triggered Rejected'
                    };
                }

            } catch (error) {
                return {
                    response: `Status update failed: ${error.message}`
                }
            }
        });

        return super.init();
    }
}

module.exports = CapexApproverCatalogService;