const cds = require("@sap/cds");
const { SELECT, INSERT, UPDATE } = cds.ql;
const SequenceHelper = require("./lib/SequenceHelper");

class CapexCatalogService extends cds.ApplicationService {
    async init() {
        const {
            Capex,
            CashFlowYear,
            ApproverHistory,
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

                // const masterData = await ecc.tx(req).run(SELECT.from('MasterDataSet'));
                // if (!masterData) {
                //     return req.error(500, 'ECC Server could not be reached');
                // }
                // await Promise.all(masterData.map(async (item) => {
                //     const existingRecord = await db.run(
                //         SELECT.from(Capex).where({ orderNumber: item.orderNumber })
                //     );

                //     if (existingRecord.length === 0) {
                //         // If the record doesn't exist, insert it
                //         console.log(`Inserting new record with orderNumber: ${item.orderNumber}`);
                //         const documentID = new SequenceHelper({
                //             db: db,
                //             sequence: "ZCAPEX_DOCUMENT_ID",
                //             table: "zcapex_CapexEntity",
                //             field: "documentID",
                //         });

                //         let number = await documentID.getNextNumber();
                //         const insertStmt = INSERT.into(Capex).entries({
                //             documentID: number.toString(),
                //             orderNumber: item.orderNumber,
                //             orderType: item.orderType,
                //             companyCode: item.companyCode,
                //             site: item.site,
                //             division: item.division,
                //             description: item.description,
                //             businessReason: item.businessReason,
                //             currency_code: item.currency,
                //             appropriationLife: item.appropriationLife,
                //             downtime: item.downtime,
                //             amount: item.amount,
                //             millLabor: item.millLabor,
                //             maintenanceLabor: item.maintenanceLabor,
                //             operationsLabor: item.operationsLabor,
                //             outsideContract: item.outsideContract,
                //             materialCost: item.materialCost,
                //             hardwareCost: item.hardwareCost,
                //             softwareCost: item.softwareCost,
                //             contingencyCost: item.contingencyCost,
                //             totalCost: item.totalCost,
                //             profitImprovementPct: item.profitImprovementPct,
                //             profitImprovementNPV: item.profitImprovementNPV,
                //             paybackWithTaxes: item.paybackWithTaxes,
                //             paybackWithoutTaxes: item.paybackWithoutTaxes,
                //             oneTimeExpenses: item.oneTimeExpenses,
                //             recurringExpenses: item.recurringExpenses,
                //             startupDate: item.startupDate,
                //             strategic: item.strategic,
                //             businessSustaining: item.businessSustaining,
                //             mandatory: item.mandatory,
                //             profitImprovement: item.profitImprovement,
                //             environmentalImpacts: item.environmentalImpacts,
                //             safetyImplications: item.safetyImplications,
                //             creditPotential: item.creditPotential,
                //             insuranceApproval: item.insuranceApproval,
                //             businessArea: item.businessArea,
                //             controllingArea: item.controllingArea,
                //             status: item.status,
                //             stonr: item.stonr
                //         });
                //         await db.run(insertStmt);
                //     } else {
                //         // If the record exists, we do nothing
                //         console.log(`Record with orderNumber: ${item.orderNumber} already exists. Skipping.`);
                //     }
                // }));
                // console.log('Synchronization with ECC completed successfully');

                let userRoles;
                let createValue;
                let approveValue;
                try {
                    // Fetch only matching approvers
                    userRoles = await ecc.tx(req).run(
                        SELECT.from('UserRolesSet').where({
                            Email: 'JIBIN.THOMAS@KRUGER.COM'.toString()
                        })
                    );

                    if (userRoles[0]?.Create === 'X') {
                        createValue = true;
                        approveValue = false;
                    }
                    else if (userRoles[0]?.Approve === 'X') {
                        createValue = false;
                        approveValue = true;
                    }

                } catch (error) {
                    console.error('Error fetching or processing user roles:', error);
                }

                req.query.where({ createdBy: req.user.id });

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
                        } else {
                            history.days = null; // Clear days if not pending
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
                                    createEnabled: createValue,
                                    approveEnabled: approveValue
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



        this.before("NEW", Capex.drafts, async (req) => {

            if (req.target.name !== "CapexCatalogService.Capex.drafts") { return; }
            const { ID } = req.data;
            req.data.status = process.env.DRAFTSTATUS;
            if (!req.data.companyCode) { req.data.companyCode = process.env.COMPANYCODE; }

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

            req.notify(428, `ATTACHMENT`, 'in/attachments');
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
                amount,
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
                    await db.run(
                        UPDATE(Capex.drafts)
                            .set({ totalCost: total })
                            .where({ ID: ID }))  // Using the current ID}
                }
            }

            console.log("new total", total)
            req.data.totalCost = total;
            // console.log(req.data)

        });

        this.on('getStatusCount', async (req) => {
            try {
                const statusKeys = ['N', 'X', 'E0011', 'D', 'E0010', 'E0009']; // Example status keys
                const statusCount = await getStatusCounts(statusKeys);

                return statusCount;
            } catch (error) {
                // Handle errors gracefully
                console.error('Error in getErrorCount:', error.message);
                // throw new Error('Failed to retrieve error count.');
            }
        });


        async function getStatusCounts(keys) {
            const keyMappings = {
                'N': 'inProgressCount',
                'X': 'Count',
                'E0011': 'rejectIncompleteCount',
                'D': 'draftCount',
                'E0010': 'rejectFinalCount',
                'E0009': 'approvedCount'
            };

            const statusCount = {};

            const conditions = keys.map(key => `status = '${key}'`).join(' OR ');
            const query = SELECT
                .from(Capex)
                .columns(['status', 'COUNT(*) AS count'])
                .where(conditions)
                .groupBy('status');

            const results = await db.run(query);

            results.forEach(result => {
                const mappedKey = keyMappings[result.status];
                statusCount[mappedKey] = result.count;
            });

            return statusCount;
        }



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
                // req.error(400, `TOTALCOST`, `in/amount`, amount);
                req.error(400, `Appropriation costs should match the total amount`, `in/totalCost`);
                // return req.error(404, `Appropriation costs should match the total amount${amount}`);
            }

            const record = await db.run(SELECT.one.from(Capex).where({ ID: ID }));

            if (req.errors) { req.reject(); }

            // let data = req.data;
            let data = JSON.parse(JSON.stringify(req.data));
            // Delete unnecessary fields
            const fieldsToDelete = [
                'currency_code', 'to_CashFlowYear', 'to_Objectives', 'attachments', 'to_RejectionReasons',
                'ID', 'status', 'documentID', 'notes', 'numericSeverity', 'to_Comments', 'downtime', 'appropriationLife',
                'targetDate', 'integerValue', 'forecastValue', 'targetValue', 'dimensions', 'fieldWithPrice',
                'starsValue', 'fieldWithUoM', 'to_ApproverHistory', 'to_Notes', 'approvedCount', 'totalApprovals',
                'createEnabled', 'approveEnabled'
            ];
            fieldsToDelete.forEach(field => delete data[field]);

            // Convert specific fields
            data.downtime = req.data.downtime !== undefined ? req.data.downtime.toString() : "0";
            data.appropriationLife = req.data.appropriationLife !== undefined ? req.data.appropriationLife.toString() : "0";
            data.currency = req.data.currency_code;
            data.orderNumber = req.data.documentID.toString();

            console.log("SAP", data);

            let errorMessage = '';
            let successData = null;

            try {
                // result = await ecc.run(INSERT.into(MasterDataSet).entries(data));
                let insertQuery = INSERT.into('MasterDataSet', [data])

                // Execute query against backend system
                let result = await ecc.tx(req).run(insertQuery)

                // If we reach here, it means the operation was successful
                successData = result;
                req.data.orderNumber = successData.orderNumber;

                console.log(`Order ${successData.orderNumber} created successfully`);
            } catch (error) {
                // Handle the error case
                if (error.code) {
                    errorMessage = error.message || "An exception was raised.";

                    // Extract more detailed error information if available
                    if (error.innerError && error.innerError.errordetails) {
                        error.innerError.errordetails.forEach(detail => {
                            errorMessage += `\n${detail.code}: ${detail.message}`;
                        });
                    }
                } else {
                    errorMessage = "An unexpected error occurred";
                }
            }

            // Now you can use errorMessage and successData as needed
            if (errorMessage) {
                req.data.notes = errorMessage;
                console.error("Error:", errorMessage);
            } else {
                console.log("Success:", successData);
            }

        });

        this.after('SAVE', Capex, async (_, req) => {
            console.log(req.data);

            const newStatus = "E0001";
            await statusChange(req, req.data.ID, newStatus);

            let approverlist;
            try {
                // Fetch only matching approvers
                approverlist = await ecc.tx(req).run(
                    SELECT.from('ApproverLevelsSet').where({
                        Site: req.data.site?.toString(),
                        Order: req.data.orderNumber?.toString(),
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
                // req.error(400, "Approver list is empty");
                // req.error(400, "Approver list is empty");
                if (req.errors) { req.reject(); }
                // throw cds.error("Approver list is either undefined or empty.", {
                //     code: 400
                // });
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
                    approverName: approver.Name
                }));

                // Explicitly update the entity if needed
                const updateHistory = await UPDATE(Capex) // Replace entityName with your actual entity name
                    .set({ to_ApproverHistory: req.data.to_ApproverHistory })
                    .where({ ID: req.data.ID });

                const currentAppHis = await db.run(
                    SELECT.from(ApproverHistory)
                        .where({ up__ID: req.data.ID, status: 'Pending' })
                );

                const lowestLevelEmail = 'jibin.thomas@msitek.us';//sortedApprovers[0]?.Email;
                const lowestLevelID = currentAppHis[0].ID;
                const lowestFolderID = req.data.attachments[0]?.folderId;
                const baseURL = "https://yk2lt6xsylvfx4dz.launchpad.cfapps.us10.hana.ondemand.com/site/Kruger#Zcapex-manage?sap-ui-app-id-hint=saas_approuter_capex&/Capex({documentID})?layout=TwoColumnsMidExpanded";
                const dynamicURL = baseURL.replace("{documentID}", req.data.documentID);
                const lowestName = currentAppHis[0].approverName;


                let testData = {
                    "definitionId": "us10.yk2lt6xsylvfx4dz.zcapexworkflow.triggerWorkflow",
                    "context": {
                        "orderNumber": req.data.orderNumber ? String(req.data.orderNumber) : "null",
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
                        "initiatorName": req.user.id
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
            // copiedCapex.HasDraftEntity = true

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

        async function approveChange(req, Status) {
            const wf_parentId = req.params[0].ID;
            //const wf_childId = req.data.childId;
            const wf_status = Status;
            // const wf_comments = req.data.comments;
            try {
                const currentRecord = await db.run(
                    SELECT.from(Capex)
                        .columns(cpx => {
                            cpx`*`,
                                cpx.to_ApproverHistory(cfy => { cfy`*` }),
                                cpx.attachments(atch => { atch`*` })
                        })
                        .where({ ID: wf_parentId })
                );
                let wf_instanceID;
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
                        const baseURL = "https://yk2lt6xsylvfx4dz.launchpad.cfapps.us10.hana.ondemand.com/site/Kruger#Zcapex-manage?sap-ui-app-id-hint=saas_approuter_capex&/Capex({documentID})?layout=TwoColumnsMidExpanded";
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
                    const newStatus = "E0010";
                    await statusChange(req, wf_parentId, newStatus);
                    return {
                        response: 'Workflow Triggered Ended'
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
            await approveChange(req, Status);
        });

        this.on("rejectFinal2", async req => {
            const Status = 'Rejected';
            const Comments = req.data.text
            await approveChange(req, Status);
        });

        this.on("rejectIncomplete", async (req) => {
            // const { ID } = req.params[0];
            // const newStatus = "E0011";
            // await statusChange(req, ID, newStatus);
            const Status = 'Rework';
            await approveChange(req, Status);
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
                                comments: wf_comments
                            })
                            .where({ up__ID: wf_parentId, ID: wf_childId })
                    );

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
                        const baseURL = "https://yk2lt6xsylvfx4dz.launchpad.cfapps.us10.hana.ondemand.com/site/Kruger#Zcapex-manage?sap-ui-app-id-hint=saas_approuter_capex&/Capex({documentID})?layout=TwoColumnsMidExpanded";
                        dynamicURL = baseURL.replace("{documentID}", currentRecord[0]?.documentID);
                        if (wf_status === 'Approved') {
                            lowestName = currentRecord[0].to_ApproverHistory[0].approverName;
                        } else if (wf_status === 'Skipped') {
                            lowestName = sortedApprovers[0].approverName;
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
                        response: 'Workflow Triggered Ended'
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

module.exports = CapexCatalogService;