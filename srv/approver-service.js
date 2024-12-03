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


                // try {
                //     // Add a filter to fetch only records created by the current user
                //     req.query.where({ currentApprover: req.user.id });

                //     // Execute the query to check for records
                //     const results = await cds.run(req.query);

                //     // If no records are found, reject the request with a custom message
                //     if (results.length === 0) {
                //         req.reject(404, 'No records found for the current user.');
                //     }
                // } catch (error) {
                //     // Handle errors gracefully
                //     req.reject(500, `An error occurred: ${error.message}`);
                // }
                let currentApprover;
                const allRecords = await db.run(
                    SELECT.from(Capex)
                        .columns(cpx => {
                            cpx`*`,
                                cpx.to_ApproverHistory(cfy => { cfy`*` });
                        })
                );

                const filteredRecords = allRecords
                    .map(record => ({
                        ...record,
                        to_ApproverHistory: record.to_ApproverHistory.filter(filter => filter.email === 'JOHN.GRANGE@KRUGERPRODUCTS.CA')
                    }))
                    .filter(record => record.to_ApproverHistory.length > 0);
                // filteredRecord = allRecords[0].to_ApproverHistory.filter(filter => filter.email === 'JOHN.GRANGE@KRUGERPRODUCTS.CA');

                for (let capex of allRecords) {
                    // Calculate the total number of approvals and count of approved statuses
                    capex.totalApprovals = capex.to_ApproverHistory.length;
                    capex.approvedCount = capex.to_ApproverHistory.filter(history => history.status === 'Approved').length;

                    // Update each `to_ApproverHistory` record's `days` field if status is "Pending"
                    for (let history of capex.to_ApproverHistory) {
                        if (history.status === 'Pending' && history.pendingDate) {
                            const pendingDate = new Date(history.pendingDate);
                            const today = new Date();
                            const diffTime = today - pendingDate;
                            history.days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Calculate days difference
                            currentApprover = 'jibin.thomas@msitek.us';//history.email;
                        } else {
                            history.days = null; // Clear days if not pending
                            currentApprover = null;
                        }
                    }
                }

                // Perform batch updates
                await Promise.all([
                    // Update Capex records
                    ...allRecords.map(capex =>
                        db.run(
                            UPDATE(Capex)
                                .set({
                                    totalApprovals: capex.totalApprovals,
                                    approvedCount: capex.approvedCount,
                                    currentApprover: currentApprover,
                                    // createEnabled: createValue,
                                    // approveEnabled: approveValue
                                })
                                .where({ ID: capex.ID })
                        )
                    ),
                    // Update ApproverHistory records with non-null days only
                    ...allRecords.flatMap(capex =>
                        capex.to_ApproverHistory
                            .filter(history => history.days !== null) // Only update if days is calculated
                            .map(history =>
                                db.run(
                                    UPDATE(ApproverHistory)
                                        .set({ days: String(history.days) }) // Convert days to string to avoid type errors
                                        .where({ ID: history.ID })
                                )
                            )
                    )
                ]);
                // const allRecords1 = await db.run(
                //     SELECT.from(Capex)
                //         .columns(cpx => {
                //             cpx`*`,
                //                 cpx.to_ApproverHistory(cfy => { cfy`*` });
                //         })
                // );
                // debugger;

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
            //const wf_childId = req.data.childId;
            const wf_status = Status;
            // const wf_comments = req.data.comments;
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
                let wf_instanceID;
                if (Comments) {
                    const newComment = {
                        up__ID: wf_parentId,
                        text: wfComments
                    };
                    try {
                        const insertedComment = await db.run(
                            INSERT.into(Comments).entries(newComment)
                        );
                    } catch (error) {
                        console.error("Error deleting workflow instance:", error);
                    }

                }
                const wf_childId = currentRecord[0]?.to_ApproverHistory?.find(record => record.status === 'Pending')?.ID;
                wf_instanceID = currentRecord[0]?.to_ApproverHistory?.find(record => record.status === 'Pending')?.instanceId;
                if (wf_status === 'Approved' || wf_status === 'Skipped') {
                    const updatedApproverHistory = await db.run(
                        UPDATE(ApproverHistory)
                            .set({
                                status: wf_status
                                // comments: wf_comments
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
                        lowestLevelEmail = 'jibin.thomas@msitek.us';//currentRecord[0]?.attachments?.[0]?.email  
                        lowestFolderID = currentRecord[0]?.attachments?.[0]?.folderId || null;
                        const baseURL = "https://yk2lt6xsylvfx4dz.launchpad.cfapps.us10.hana.ondemand.com/site/Kruger#zcapexapprover-manage?sap-ui-app-id-hint=saas_approuter_capex&/Capex({documentID})?layout=TwoColumnsMidExpanded";
                        dynamicURL = baseURL.replace("{documentID}", currentRecord[0]?.documentID);
                        if (wf_status === 'Approved') {
                            lowestName = currentRecord[0].to_ApproverHistory[0].approverName;
                        } else if (wf_status === 'Skipped') {
                            lowestName = sortedApprovers[0].approverName;
                            wf_instanceID = sortedApprovers[0].instanceId;
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

                    return {
                        response: `${response} ${lowestLevelID} 'Workflow Triggered'`
                    };
                } else if (wf_status === 'Rejected') {
                    const updatedApproverHistory = await db.run(
                        UPDATE(ApproverHistory)
                            .set({
                                status: wf_status
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

        this.on("validate", async req => {
            const Status = 'Skipped';
            const Comments = req.data.text
            await approveChange(req, Status, Comments);
        });

        this.on("rejectFinal2", async req => {
            const Status = 'Rejected';
            const Comments = req.data.text;
            await approveChange(req, Status, Comments);
        });

        this.on("rejectIncomplete", async (req) => {
            // const { ID } = req.params[0];
            // const newStatus = "E0011";
            // await statusChange(req, ID, newStatus);
            const Comments = req.data.text
            const Status = 'Rework';
            await approveChange(req, Status, Comments);
        });

        this.on("approve", async (req) => {
            // const { ID } = req.params[0];
            const Status = 'Approved';
            await approveChange(req, Status);
            // const newStatus = "E0009";
            // await statusChange(req, ID, newStatus);
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
                        lowestLevelEmail = 'jibin.thomas@msitek.us';
                        lowestLevelID = sortedApprovers[0]?.ID;
                        lowestFolderID = currentRecord[0]?.attachments?.[0]?.folderId || null;
                        const baseURL = "https://yk2lt6xsylvfx4dz.launchpad.cfapps.us10.hana.ondemand.com/site/Kruger#zcapexapprover-manage?sap-ui-app-id-hint=saas_approuter_capex&/Capex({documentID})?layout=TwoColumnsMidExpanded";
                        dynamicURL = baseURL.replace("{documentID}", currentRecord[0]?.documentID);
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