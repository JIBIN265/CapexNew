const cds = require("@sap/cds");
const { SELECT, INSERT, UPDATE } = cds.ql;
const SequenceHelper = require("./lib/SequenceHelper");
const defaults = require("dotenv").config({
    path: "./srv/defaults/sap-defaults.env",
});

class CapexCreatorCatalogService extends cds.ApplicationService {
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
            UserRolesSet,
            // Attachments
            // Capex_attachments
        } = this.entities;

        // const { attachments } = Capex.attachments;

        const db = await cds.connect.to("db");

        const ecc = await cds.connect.to('ZODATA_INTERNAL_ORDER_SRV');

        this.on('READ', [Cot001Set, OrderTypeF4Set, BusinessReasonF4Set,
            DivisionF4Set, SiteF4Set, CurrencyF4Set, MasterDataSet,
            UserRolesSet, ApproverLevelsSet], async req => {
                return ecc.run(req.query);

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
                            const pendingDate = new Date(history.pendingDate);
                            const currentDate = new Date();
                            const days = calculateWeekdays(pendingDate, currentDate);
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

        this.before("NEW", Capex.drafts, async (req) => {

            if (req.target.name !== "CapexCreatorCatalogService.Capex.drafts") { return; }
            const { ID } = req.data;
            req.data.status = 'D';//process.env.DRAFTSTATUS;
            req.data.currency_code = 'CAD';
            if (!req.data.companyCode) { req.data.companyCode = '2000'; }//process.env.COMPANYCODE; }

            const documentID = new SequenceHelper({
                db: db,
                sequence: "ZCAPEX_DOCUMENT_ID",
                table: "zcapex_CapexEntity",
                field: "documentID",
            });

            let number = await documentID.getNextNumber();
            req.data.documentID = number.toString();
            if (!req.data.to_Objectives) {
                const records = await db.run(SELECT.from(Sustainability2030));
                req.data.to_Objectives = records;
            }
            req.data.totalApprovals = 0;
            req.data.approvedCount = 0;
        });



        this.before('UPDATE', Capex.drafts, async (req) => {
            console.log("UPDATE Capex.drafts:");
            const {
                ID,
                millLabor,
                maintenanceLabor,
                operationsLabor,
                outsideContract,
                materialCost,
                hardwareCost,
                softwareCost,
                contingencyCost,
                amount
            } = req.data;

            // Initialize total to 0
            let total = 0;
            const record = await db.run(SELECT.one.from(Capex.drafts).where({ ID: ID }));
            //console.log(record);
            if (record) {
                // Use existing values from the record if any of the new values are undefined
                const existingMillLabor = millLabor !== undefined ? Number(millLabor) : Number(record.millLabor);
                const existingMaintenanceLabor = maintenanceLabor !== undefined ? Number(maintenanceLabor) : Number(record.maintenanceLabor);
                const existingOperationsLabor = operationsLabor !== undefined ? Number(operationsLabor) : Number(record.operationsLabor);
                const existingOutsideContract = outsideContract !== undefined ? Number(outsideContract) : Number(record.outsideContract);
                const existingMaterialCost = materialCost !== undefined ? Number(materialCost) : Number(record.materialCost);
                const existingHardwareCost = hardwareCost !== undefined ? Number(hardwareCost) : Number(record.hardwareCost);
                const existingSoftwareCost = softwareCost !== undefined ? Number(softwareCost) : Number(record.softwareCost);
                const existingContingencyCost = contingencyCost !== undefined ? Number(contingencyCost) : Number(record.contingencyCost);
                const existingAmount = amount !== undefined ? Number(amount) : Number(record.amount);

                // Calculate total
                total = existingMillLabor + existingMaintenanceLabor + existingOperationsLabor + existingOutsideContract +
                    existingMaterialCost + existingHardwareCost + existingSoftwareCost + existingContingencyCost;

                if (existingAmount < total) {
                    req.warn(404, `Exceeded Total Amount`);
                }

                if (total) {
                    await cds.run(
                        UPDATE(Capex.drafts)
                            .set({ totalCost: total })
                            .where({ ID: ID }))  // Using the current ID}
                }
            }

            console.log("new total", total)
            req.data.totalCost = total;
            // console.log(req.data)

        });

        this.on('getMessages', async (req) => {
            const { Key } = req.data
            try {

                const { text } = await db.run(SELECT.one.from(Comments)
                    .columns(['text']).where({ up__ID: Key }));
                const messageImport = {
                    notes: text
                }
                return messageImport
            } catch (error) {
                // Handle errors gracefully
                console.error('Error in getErrorCount:', error.message);
                // throw new Error('Failed to retrieve error count.');
            }
        });


        this.before('UPDATE', CashFlowYear.drafts, async (req) => {
            console.log("UPDATE before CashFlowYear.drafts:");

            const {
                ID,
                year,
                cashFlowQOne,
                cashFlowQTwo,
                cashFlowQThree,
                cashFlowQFour
            } = req.data;

            const currentYear = new Date().getFullYear();
            if (year) {
                if (!/^\d{4}$/.test(year) || year < 1900 || year > currentYear + 90) {
                    req.warn(404, `Invalid year. Please enter a 4-digit valid year.`);
                }
            }

            // Initialize total to 0
            let total = 0;
            const record = await db.run(SELECT.one.from(CashFlowYear.drafts).where({ ID: ID }));
            if (record) {
                // Use existing values from the record if any of the new values are undefined
                const existingCashFlowQOne = cashFlowQOne !== undefined ? Number(cashFlowQOne) : Number(record.cashFlowQOne);
                const existingCashFlowQTwo = cashFlowQTwo !== undefined ? Number(cashFlowQTwo) : Number(record.cashFlowQTwo);
                const existingCashFlowQThree = cashFlowQThree !== undefined ? Number(cashFlowQThree) : Number(record.cashFlowQThree);
                const existingCashFlowQFour = cashFlowQFour !== undefined ? Number(cashFlowQFour) : Number(record.cashFlowQFour);
                const existingyear = year !== undefined ? Number(year) : Number(record.year);

                // Calculate total
                total = existingCashFlowQOne + existingCashFlowQTwo + existingCashFlowQThree + existingCashFlowQFour;

                if (total) {
                    await db.run(
                        UPDATE(CashFlowYear.drafts)
                            .set({ total: total })
                            .where({ ID: ID }))  // Using the current ID}
                }
            }

            console.log("new total", total)
            req.data.total = total;
            console.log(req.data)
        });


        this.after('NEW', "CashFlowYear.drafts", async (_, req) => {
            console.log("NEW CashFlowYear.drafts:");
            console.log(req.data);
            console.log(_);
            const {
                cashFlowQOne,
                cashFlowQTwo,
                cashFlowQThree,
                cashFlowQFour
            } = req.data;
            const {
                ID,
                DraftAdministrativeData_DraftUUID
            } = _;
            console.log(ID);
            const record = await db.run(SELECT.one.from(CashFlowYear.drafts).where({ ID: ID }));
            console.log(record);
            // Initialize total to 0
            let total = 0;

            if (cashFlowQOne !== undefined) total += Number(cashFlowQOne);
            if (cashFlowQTwo !== undefined) total += Number(cashFlowQTwo);
            if (cashFlowQThree !== undefined) total += Number(cashFlowQThree);
            if (cashFlowQFour !== undefined) total += Number(cashFlowQFour);

            req.data.total = total;
            if (record && total) {
                await db.run(
                    UPDATE(CashFlowYear.drafts)
                        .set({ total: total })
                        .where({ ID: ID }))  // Using the current ID}
            }
            console.log("Calculated total:", req.data.total);
        });

        this.before('READ', Capex.drafts, async (req) => {
            const attachments = await db.run(
                SELECT.from('CAPEXCREATORCATALOGSERVICE_CAPEX_ATTACHMENTS_DRAFTS')
                    .columns(ath => {
                        ath`*`
                    })
                    .where({ up__ID: req.data.ID, mimeType: "application/octet-stream" })
            );

            for (const attachment of attachments) {
                // Extract filename and check if it ends with '.pdf'
                if (attachment.FILENAME && attachment.FILENAME.toLowerCase().endsWith('.pdf')) {
                    await db.run(
                        UPDATE('CAPEXCREATORCATALOGSERVICE_CAPEX_ATTACHMENTS_DRAFTS')
                            .set({ mimeType: 'application/pdf' })
                            .where({ ID: attachment.ID })
                    );
                }
            }
        });


        this.before('SAVE', Capex, async req => {
            const { attachments } = req.data;

            if (!attachments || attachments.length === 0) {
                req.error(400, `Please add an attachment`, `in/attachments`);
            }

            if (!req.event === 'CREATE' && !req.event === 'UPDATE') { return; }  //only calculate if create or update
            const {
                ID,
                totalCost,
                amount,
            } = req.data;

            if (totalCost !== amount) {
                req.error(400, `Appropriation costs should match the total amount `, `in/amount`);
            }

            if (req.errors) { req.reject(); }

        });

        this.after('SAVE', Capex, async (_, req) => {
            console.log(req.data);

            const { attachments } = req.data;
            if (!attachments || attachments.length === 0) {
                req.error(400, `Please add an attachment`, `in/attachments`);
            }

            if (req.errors) { req.reject(); }

            let data = JSON.parse(JSON.stringify(req.data));
            // Delete unnecessary fields
            const fieldsToDelete = [
                'currency_code', 'to_CashFlowYear', 'to_Objectives', 'attachments', 'to_RejectionReasons',
                'ID', 'status', 'documentID', 'notes', 'numericSeverity', 'to_Comments', 'downtime', 'appropriationLife',
                'targetDate', 'integerValue', 'forecastValue', 'targetValue', 'dimensions', 'fieldWithPrice',
                'starsValue', 'fieldWithUoM', 'to_ApproverHistory', 'to_Notes', 'approvedCount', 'totalApprovals',
                'currentApprover', 'currentUser', 'createdAt', 'createdBy', 'modifiedAt', 'modifiedBy'
            ];
            if (data) {
                fieldsToDelete.forEach(field => delete data[field]);
                // Convert specific fields
                data.downtime = req.data.downtime !== undefined ? req.data.downtime.toString() : "0";
                data.appropriationLife = req.data.appropriationLife !== undefined ? req.data.appropriationLife.toString() : "0";
                data.currency = req.data.currency_code;
                data.orderNumber = req.data.documentID.toString();
                data.userName = req.user.id;
                console.log("SAP", data);
            }
            let errorMessage = '';
            let successData = null;

            try {
                // result = await ecc.run(INSERT.into(MasterDataSet).entries(data));
                let insertQuery = INSERT.into('MasterDataSet', [data])

                // Execute query against backend system
                let result = await ecc.tx(req).run(insertQuery)

                // If we reach here, it means the operation was successful
                successData = result;
                const updateOrder = await UPDATE(Capex)
                    .set({
                        orderNumber: successData.orderNumber
                    })
                    .where({ ID: req.data.ID });

                console.log(`Order ${successData.orderNumber} created successfully`);
            }
            catch (error) {
                req.data.notes = error.message;
                req.error(404, error.message);
                if (req.errors) { req.reject(); }
                console.log("Error:", error.message);
            }

            const newStatus = "E0001";
            await statusChange(req, req.data.ID, newStatus);

            let crOrderNumber = successData.orderNumber;
            let approverlist;
            let currentApprover;
            try {
                // Fetch only matching approvers
                approverlist = await ecc.tx(req).run(
                    SELECT.from('ApproverLevelsSet').where({
                        Site: req.data.site?.toString(),
                        Order: crOrderNumber?.toString(),
                        OrderType: req.data.orderType?.toString(),
                        Division: req.data.division?.toString(),
                        Amount: req.data.amount?.toString(),
                        Currency: req.data.currency_code?.toString()
                    })
                );
            } catch (error) {
                console.error('Error fetching or processing approverlist:', error);
            }

            if (!approverlist || approverlist.length === 0) {
                req.error(400, "Approver list is empty");
                if (req.errors) { req.reject(); }
            } else {
                // Sort approverlist by Level in ascending order
                const sortedApprovers = approverlist.sort((a, b) => a.Level - b.Level);

                // Map the fields into req.data.to_ApproverHistory array
                req.data.to_ApproverHistory = sortedApprovers.map((approver, index) => ({
                    site: approver.Site,
                    level: approver.Level,
                    email: approver.Email,
                    status: index === 0 ? 'Pending' : 'Not initiated',
                    days: index === 0 ? '1' : null,
                    pendingDate: index === 0 ? new Date().toISOString() : null,
                    approverName: approver.Name,
                    estat: approver.Estat,
                    zappLevel: approver.InternalLevel,
                }));

                // Explicitly update the entity if needed
                const updateHistory = await UPDATE(Capex) // Replace entityName with your actual entity name
                    .set({ to_ApproverHistory: req.data.to_ApproverHistory })
                    .where({ ID: req.data.ID });


                currentApprover = sortedApprovers[0]?.Email;
                const updateMain = await UPDATE(Capex)
                    .set({
                        totalApprovals: req.data.to_ApproverHistory.length,
                        approvedCount: 0,
                        currentApprover: currentApprover
                    })
                    .where({ ID: req.data.ID });

                const currentAppHis = await db.run(
                    SELECT.from(ApproverHistory)
                        .where({ up__ID: req.data.ID, status: 'Pending' })
                );

                const lowestLevelEmail = currentApprover;
                const lowestLevelID = currentAppHis[0].ID;
                const lowestFolderID = req.data.attachments[0]?.folderId;
                const baseURL = "https://capex-development-683d45ho.launchpad.cfapps.ca10.hana.ondemand.com/site/Kruger#zcapexapprover-manage?sap-ui-app-id-hint=saas_approuter_zcapexapprover&/Capex({documentID})?layout=TwoColumnsMidExpanded";
                const dynamicURL = baseURL.replace("{documentID}", req.data.documentID);
                const userURL = "https://capex-development-683d45ho.launchpad.cfapps.ca10.hana.ondemand.com/site/Kruger#zcapexcreator-manage?sap-ui-app-id-hint=saas_approuter_zcapexcreator&/Capex({documentID})?layout=TwoColumnsMidExpanded";
                const dyuserURL = userURL.replace("{documentID}", req.data.documentID);
                const lowestName = currentAppHis[0].approverName;
                const fullName = getFullNameFromEmail(req.user.id);

                let testData = {
                    "definitionId": "ca10.capex-development-683d45ho.zcapexopexworkflow.triggerWorkflow",
                    "context": {
                        "orderNumber": crOrderNumber ? String(crOrderNumber) : "null",
                        "orderType": req.data.orderType ? String(req.data.orderType) : "null",
                        "companyCode": req.data.companyCode ? String(req.data.companyCode) : "null",
                        "site": req.data.site ? String(req.data.site) : "null",
                        "division": req.data.division ? String(req.data.division) : "null",
                        "description": req.data.description ? String(req.data.description) : "null",
                        "businessReasons": req.data.businessReason ? req.data.businessReason : "null",
                        "amount": req.data.amount ? String(req.data.amount) : "null",
                        "currency": req.data.currency_code ? req.data.currency_code : "null",
                        "appropriationsCosts": [
                            {
                                "millLabor": req.data.millLabor ? String(req.data.millLabor) : "0.00",
                                "maintenanceLabor": req.data.maintenanceLabor ? String(req.data.maintenanceLabor) : "0.00",
                                "operationsLabor": req.data.operationsLabor ? String(req.data.operationsLabor) : "0.00",
                                "outsideContract": req.data.outsideContract ? String(req.data.outsideContract) : "0.00",
                                "materialCost": req.data.materialCost ? String(req.data.materialCost) : "0.00",
                                "hardwareCost": req.data.hardwareCost ? String(req.data.hardwareCost) : "0.00",
                                "softwareCost": req.data.softwareCost ? String(req.data.softwareCost) : "0.00",
                                "contingencyCost": req.data.contingencyCost ? String(req.data.contingencyCost) : "0.00",
                                "totalCost": req.data.totalCost ? String(req.data.totalCost) : "0.00"
                            }
                        ],
                        "approver": lowestLevelEmail ? lowestLevelEmail : "null",
                        "_id": req.data.ID ? String(req.data.ID) : "null",
                        "childId": lowestLevelID ? String(lowestLevelID) : "null",
                        "folderId": lowestFolderID ? String(lowestFolderID) : "null",
                        "url": dynamicURL ? String(dynamicURL) : "null",
                        "approverName": lowestName ? String(lowestName) : "null",
                        "initiator": req.user.id,
                        "initiatorName": fullName ? String(fullName) : "null",
                        "userUrl": dyuserURL ? String(dyuserURL) : "null",
                        "action": "Create",
                        "decision": "Level1",
                        "appComments": ""

                    }
                };

                let BPA_WORKFLOW = await cds.connect.to('BPA_WORKFLOW');

                let response = await BPA_WORKFLOW.send('POST', '/', testData);

                const updatedApproverHistory = await db.run(
                    UPDATE(ApproverHistory)
                        .set({
                            instanceId: response.rootInstanceId
                        })
                        .where({ up__ID: req.data.ID, ID: lowestLevelID })
                );

                if (response.status >= 200 && response.status < 300) {
                    console.log('Success:', response.data);
                } else {
                    console.log('Error:', response.status, response.statusText);
                }
            }
        });

        this.on('copyCapex', async (req) => {
            const { ID } = req.params[0];
            const originalCapex = await db.run(
                SELECT.one.from(Capex)
                    .columns(cpx => {
                        cpx`*`,                   // Select all columns from Capex
                            cpx.to_CashFlowYear(cfy => { cfy`*` }) // Select all columns from the composition entity CashFlowYear
                    })
                    .where({ ID: ID })
            );

            if (!originalCapex) {
                const draftCapex = await db.run(
                    SELECT.one.from(Capex.drafts)
                        .columns(cpx => {
                            cpx`*`,                   // Select all columns from Capex
                                cpx.to_CashFlowYear(cfy => { cfy`*` }) // Select all columns from the composition entity CashFlowYear
                        })
                        .where({ ID: ID })
                );
                if (draftCapex) {
                    req.error(404, 'You cannot copy a Draft Order');
                }
                else {
                    req.error(404, 'Please contact Kruger SAP IT');
                }
                if (req.errors) { req.reject(); }
            }
            // Create a deep copy of the entity
            const copiedCapex = Object.assign({}, originalCapex);
            delete copiedCapex.ID;  // Remove the ID to ensure a new entity is created
            delete copiedCapex.createdAt;
            delete copiedCapex.createdBy;
            delete copiedCapex.modifiedAt;
            delete copiedCapex.modifiedBy;
            delete copiedCapex.HasActiveEntity;
            delete copiedCapex.HasDraftEntity;
            delete copiedCapex.IsActiveEntity;

            delete copiedCapex.orderNumber;
            delete copiedCapex.millLabor;
            delete copiedCapex.maintenanceLabor;
            delete copiedCapex.operationsLabor;
            delete copiedCapex.outsideContract;
            delete copiedCapex.materialCost;
            delete copiedCapex.hardwareCost;
            delete copiedCapex.softwareCost;
            delete copiedCapex.contingencyCost;
            delete copiedCapex.totalCost;

            // copiedCapex.HasActiveEntity = false;
            copiedCapex.DraftAdministrativeData_DraftUUID = cds.utils.uuid();
            // Ensure all related entities are copied
            if (originalCapex.to_CashFlowYear) {
                copiedCapex.to_CashFlowYear = originalCapex.to_CashFlowYear.map(cashFlow => {
                    const copiedCashFlow = Object.assign({}, cashFlow);
                    delete copiedCashFlow.ID; // Remove the ID to create a new related entity
                    delete copiedCashFlow.up__ID;
                    delete copiedCashFlow.createdAt;
                    delete copiedCashFlow.createdBy;
                    delete copiedCashFlow.modifiedAt;
                    delete copiedCashFlow.modifiedBy;
                    copiedCashFlow.DraftAdministrativeData_DraftUUID = cds.utils.uuid();
                    return copiedCashFlow;
                });
            }
            //create a draft
            const oCapex = await this.send({
                query: INSERT.into(Capex).entries(copiedCapex),
                event: "NEW",
            });

            //return the draft
            if (!oCapex) {
                req.notify("Copy failed");
            }
            else {
                req.notify("Order has been successfully copied and saved as a new draft.");
                return oCapex;
            }


        });

        function getFullNameFromEmail(email) {
            if (!email || !email.includes('@')) {
                return null; // Return null for invalid email
            }

            // Extract the part before '@'
            const namePart = email.split('@')[0];

            // Replace '.' with a space and return the result
            // const fullName = namePart.replace('.', ' ');
            const fullName = namePart
                .split('.')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(' ');

            return fullName;
        }

        function calculateWeekdays(startDate, endDate) {
            let count = 0;
            let currentDate = new Date(startDate);
            while (currentDate <= endDate) {
                const dayOfWeek = currentDate.getDay();
                if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Exclude Sundays (0) and Saturdays (6)
                    count++;
                }
                currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
            }
            return count - 1; // Subtract 1 to exclude the start date itself
        }

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

        return super.init();
    }
}

module.exports = CapexCreatorCatalogService;