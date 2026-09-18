CREATE procedure [dbo].[GetClientTransactionList_v2]
	@AssociateId bigint,
	@FromDate date,
	@ToDate date,
	@PANCardNumber varchar(50)
as
	declare @AssociateCode varchar(10)

	set @AssociateCode = ''

	if(@AssociateId <> 0)begin
		set @AssociateCode = (select '19941' + AssociateCode from Associate where Id = @AssociateId)
	end

	select ct.Id,TransactionDate,TransactionTypeId,TransactionPlanId,Amount,TransactionTypeName,TransactionTypeCode,TransactionPlanName,TransactionPlanCode,
		PaymentType,SubTransactionType,TradeStatus,
		isnull(ClientAccountId,0) as ClientAccountId,isnull(cas.Name,isnull(ctna.FirstHolderName,'')) as ClientName,
		isnull(cas.UCC,'') as UCC,isnull(cas.PANCardNumber,isnull(ctna.PANCardNumber,'')) as PANCardNumber,
		(case isnull(a.EntityName,'') when '' then a.Name else a.EntityName end) as AssociateName,'S' as RecordType,'' as TradeType,
		'' as FolioNumber,'' as SchemeName,'' as TransactionId,0 as NAV,0 as Units,null as TransactionCompletedDate,
		isnull(cas.EmployeeId,0) as EmployeeId
	from (
			select ct.Id,TransactionDate,TransactionTypeId,TransactionPlanId,tt.Name as TransactionTypeName,tt.Code as TransactionTypeCode,
				tp.Name as TransactionPlanName,tp.Code as TransactionPlanCode,
				(case sctp.ClientTransactionPortfolioId when 0 then isnull(sctp.PaymentType,'') else 'Multiple Payments' end) as PaymentType,
				'NA' as SubTransactionType,ct.TradeStatus,ctp.Amount
			from ClientTransaction ct inner join TransactionType tt on ct.TransactionTypeId = tt.Id
				inner join TransactionPlan tp on ct.TransactionPlanId = tp.Id
				inner join (
					select ct1.Id as ClientTransactionId, sum(Amount) as Amount
					from ClientTransaction ct1 inner join ClientTransactionPortfolio ctp1 on ct1.Id = ctp1.ClientTransactionId
						inner join TransactionType tt1 on ct1.TransactionTypeId = tt1.Id
						inner join TransactionPlan tp1 on ct1.TransactionPlanId = tp1.Id
					where ct1.TradeStatus not in ('','In-Complete')
						and (TransactionDate >= DATEADD(MINUTE, -330, CONVERT(datetime, @FromDate)) AND TransactionDate < DATEADD(MINUTE, -330, DATEADD(DAY, 1, CONVERT(datetime, @ToDate))))
						and tt1.Code = 'B'
						and tp1.Code = 'L'
					group by ct1.Id
				) as ctp on ct.Id = ctp.ClientTransactionId
				left join (
					select ctp.ClientTransactionId,ctp.PaymentType,isnull(ctpp.ClientTransactionPortfolioId,0) as ClientTransactionPortfolioId
					from ClientTransactionPayment ctp left join ClientTransactionPaymentPortfolio ctpp on ctp.Id = ctpp.ClientTransactionPaymentId
					where ctpp.ClientTransactionPortfolioId is null
					union
					select ctp.ClientTransactionId,ctp.PaymentType,isnull(ctpp.ClientTransactionPortfolioId,0) as ClientTransactionPortfolioId
					from ClientTransactionPaymentMandate ctp left join ClientTransactionPaymentMandatePortfolio ctpp on ctp.Id = ctpp.ClientTransactionPaymentMandateId
					where ctpp.ClientTransactionPortfolioId is null
				) as sctp on ct.Id = sctp.ClientTransactionId
			where ct.TradeStatus not in ('','In-Complete')
				and (TransactionDate >= DATEADD(MINUTE, -330, CONVERT(datetime, @FromDate)) AND TransactionDate < DATEADD(MINUTE, -330, DATEADD(DAY, 1, CONVERT(datetime, @ToDate))))
				and tt.Code = 'B'
				and tp.Code = 'L'
				and Amount > 0
			union all
			select ct.Id,TransactionDate,TransactionTypeId,TransactionPlanId,tt.Name as TransactionTypeName,tt.Code as TransactionTypeCode,
				tp.Name as TransactionPlanName,tp.Code as TransactionPlanCode,
				'Mandate' as PaymentType,
				'SIP' as SubTransactionType,ct.TradeStatus,ctp.Amount
			from ClientTransaction ct inner join TransactionType tt on ct.TransactionTypeId = tt.Id
				inner join TransactionPlan tp on ct.TransactionPlanId = tp.Id
				inner join (
					select ct1.Id as ClientTransactionId, sum(SIPAmount) as Amount
					from ClientTransaction ct1 inner join ClientTransactionPortfolio ctp1 on ct1.Id = ctp1.ClientTransactionId
						inner join TransactionType tt1 on ct1.TransactionTypeId = tt1.Id
						inner join TransactionPlan tp1 on ct1.TransactionPlanId = tp1.Id
					where ct1.TradeStatus not in ('','In-Complete')
						and (TransactionDate >= DATEADD(MINUTE, -330, CONVERT(datetime, @FromDate)) AND TransactionDate < DATEADD(MINUTE, -330, DATEADD(DAY, 1, CONVERT(datetime, @ToDate))))
						and tt1.Code = 'B'
						and tp1.Code = 'L'
						and ctp1.SubTransactionType = 'SIP'
					group by ct1.Id
				) as ctp on ct.Id = ctp.ClientTransactionId
				left join (
					select ctp.ClientTransactionId,ctp.PaymentType,isnull(ctpp.ClientTransactionPortfolioId,0) as ClientTransactionPortfolioId
					from ClientTransactionPayment ctp left join ClientTransactionPaymentPortfolio ctpp on ctp.Id = ctpp.ClientTransactionPaymentId
					where ctpp.ClientTransactionPortfolioId is null
					union
					select ctp.ClientTransactionId,ctp.PaymentType,isnull(ctpp.ClientTransactionPortfolioId,0) as ClientTransactionPortfolioId
					from ClientTransactionPaymentMandate ctp left join ClientTransactionPaymentMandatePortfolio ctpp on ctp.Id = ctpp.ClientTransactionPaymentMandateId
					where ctpp.ClientTransactionPortfolioId is null
				) as sctp on ct.Id = sctp.ClientTransactionId
			where ct.TradeStatus not in ('','In-Complete')
				and (TransactionDate >= DATEADD(MINUTE, -330, CONVERT(datetime, @FromDate)) AND TransactionDate < DATEADD(MINUTE, -330, DATEADD(DAY, 1, CONVERT(datetime, @ToDate))))
				and tt.Code = 'B'
				and tp.Code = 'L'
			union all
			select ct.Id,TransactionDate,TransactionTypeId,TransactionPlanId,tt.Name as TransactionTypeName,tt.Code as TransactionTypeCode,
				tp.Name as TransactionPlanName,tp.Code as TransactionPlanCode,
				(case sctp.ClientTransactionPortfolioId when 0 then isnull(sctp.PaymentType,'') else '' end) as PaymentType,
				'SWP' as SubTransactionType,ct.TradeStatus,ctp.Amount
			from ClientTransaction ct inner join TransactionType tt on ct.TransactionTypeId = tt.Id
				inner join TransactionPlan tp on ct.TransactionPlanId = tp.Id
				inner join (
					select ct1.Id as ClientTransactionId, sum(SWPAmount) as Amount
					from ClientTransaction ct1 inner join ClientTransactionPortfolio ctp1 on ct1.Id = ctp1.ClientTransactionId
						inner join TransactionType tt1 on ct1.TransactionTypeId = tt1.Id
						inner join TransactionPlan tp1 on ct1.TransactionPlanId = tp1.Id
					where ct1.TradeStatus not in ('','In-Complete')
						and (TransactionDate >= DATEADD(MINUTE, -330, CONVERT(datetime, @FromDate)) AND TransactionDate < DATEADD(MINUTE, -330, DATEADD(DAY, 1, CONVERT(datetime, @ToDate))))
						and tt1.Code = 'B'
						and tp1.Code = 'L'
						and ctp1.SubTransactionType = 'SWP'
					group by ct1.Id
				) as ctp on ct.Id = ctp.ClientTransactionId
				left join (
					select ctp.ClientTransactionId,ctp.PaymentType,isnull(ctpp.ClientTransactionPortfolioId,0) as ClientTransactionPortfolioId
					from ClientTransactionPayment ctp left join ClientTransactionPaymentPortfolio ctpp on ctp.Id = ctpp.ClientTransactionPaymentId
					where ctpp.ClientTransactionPortfolioId is null
					union
					select ctp.ClientTransactionId,ctp.PaymentType,isnull(ctpp.ClientTransactionPortfolioId,0) as ClientTransactionPortfolioId
					from ClientTransactionPaymentMandate ctp left join ClientTransactionPaymentMandatePortfolio ctpp on ctp.Id = ctpp.ClientTransactionPaymentMandateId
					where ctpp.ClientTransactionPortfolioId is null
				) as sctp on ct.Id = sctp.ClientTransactionId
			where ct.TradeStatus not in ('','In-Complete')
				and (TransactionDate >= DATEADD(MINUTE, -330, CONVERT(datetime, @FromDate)) AND TransactionDate < DATEADD(MINUTE, -330, DATEADD(DAY, 1, CONVERT(datetime, @ToDate))))
				and tt.Code = 'B'
				and tp.Code = 'L'
			union all
			select ct.Id,TransactionDate,TransactionTypeId,TransactionPlanId,tt.Name as TransactionTypeName,tt.Code as TransactionTypeCode,
				tp.Name as TransactionPlanName,tp.Code as TransactionPlanCode,
				'Mandate' as PaymentType,
				'SIP' as SubTransactionType,ct.TradeStatus,ctp.Amount
			from ClientTransaction ct inner join TransactionType tt on ct.TransactionTypeId = tt.Id
				inner join TransactionPlan tp on ct.TransactionPlanId = tp.Id
				inner join (
					select ct1.Id as ClientTransactionId, sum(SIPAmount) as Amount
					from ClientTransaction ct1 inner join ClientTransactionPortfolio ctp1 on ct1.Id = ctp1.ClientTransactionId
						inner join TransactionType tt1 on ct1.TransactionTypeId = tt1.Id
						inner join TransactionPlan tp1 on ct1.TransactionPlanId = tp1.Id
					where ct1.TradeStatus not in ('','In-Complete')
						and (TransactionDate >= DATEADD(MINUTE, -330, CONVERT(datetime, @FromDate)) AND TransactionDate < DATEADD(MINUTE, -330, DATEADD(DAY, 1, CONVERT(datetime, @ToDate))))
						and tt1.Code = 'B'
						and tp1.Code = 'SIP'
						and ctp1.SubTransactionType = 'SIP'
					group by ct1.Id
				) as ctp on ct.Id = ctp.ClientTransactionId
				left join (
					select ctp.ClientTransactionId,ctp.PaymentType,isnull(ctpp.ClientTransactionPortfolioId,0) as ClientTransactionPortfolioId
					from ClientTransactionPayment ctp left join ClientTransactionPaymentPortfolio ctpp on ctp.Id = ctpp.ClientTransactionPaymentId
					where ctpp.ClientTransactionPortfolioId is null
					union
					select ctp.ClientTransactionId,ctp.PaymentType,isnull(ctpp.ClientTransactionPortfolioId,0) as ClientTransactionPortfolioId
					from ClientTransactionPaymentMandate ctp left join ClientTransactionPaymentMandatePortfolio ctpp on ctp.Id = ctpp.ClientTransactionPaymentMandateId
					where ctpp.ClientTransactionPortfolioId is null
				) as sctp on ct.Id = sctp.ClientTransactionId
			where ct.TradeStatus not in ('','In-Complete')
				and (TransactionDate >= DATEADD(MINUTE, -330, CONVERT(datetime, @FromDate)) AND TransactionDate < DATEADD(MINUTE, -330, DATEADD(DAY, 1, CONVERT(datetime, @ToDate))))
				and tt.Code = 'B'
				and tp.Code = 'SIP'
			union all
			select ct.Id,TransactionDate,TransactionTypeId,TransactionPlanId,tt.Name as TransactionTypeName,tt.Code as TransactionTypeCode,
				tp.Name as TransactionPlanName,tp.Code as TransactionPlanCode,
				'' as PaymentType,
				'NA' as SubTransactionType,ct.TradeStatus,ctp.Amount
			from ClientTransaction ct inner join TransactionType tt on ct.TransactionTypeId = tt.Id
				inner join TransactionPlan tp on ct.TransactionPlanId = tp.Id
				inner join (
					select ct1.Id as ClientTransactionId, Amount
					from ClientTransaction ct1 inner join ClientTransactionPortfolio ctp1 on ct1.Id = ctp1.ClientTransactionId
						inner join TransactionType tt1 on ct1.TransactionTypeId = tt1.Id
						inner join TransactionPlan tp1 on ct1.TransactionPlanId = tp1.Id
						inner join ClientTransactionPortfolioType ctpt1 on ctp1.ClientTransactionPortfolioTypeId = ctpt1.Id
						inner join TransactionPortfolioType tpt1 on ctpt1.TransactionPortfolioTypeId = tpt1.Id
					where ct1.TradeStatus not in ('','In-Complete')
						and (TransactionDate >= DATEADD(MINUTE, -330, CONVERT(datetime, @FromDate)) AND TransactionDate < DATEADD(MINUTE, -330, DATEADD(DAY, 1, CONVERT(datetime, @ToDate))))
						and tt1.Code = 'S'
						and tp1.Code = 'L'
						and tpt1.Code = 'A'
						and Amount > 0
					union
					select ct1.Id as ClientTransactionId, sum(Amount) as Amount
					from ClientTransaction ct1 inner join ClientTransactionPortfolio ctp1 on ct1.Id = ctp1.ClientTransactionId
						inner join TransactionType tt1 on ct1.TransactionTypeId = tt1.Id
						inner join TransactionPlan tp1 on ct1.TransactionPlanId = tp1.Id
					where ct1.TradeStatus not in ('','In-Complete')
						and (TransactionDate >= DATEADD(MINUTE, -330, CONVERT(datetime, @FromDate)) AND TransactionDate < DATEADD(MINUTE, -330, DATEADD(DAY, 1, CONVERT(datetime, @ToDate))))
						and tt1.Code = 'S'
						and tp1.Code = 'L'
						and ct1.Id not in (
							select ct1.Id
							from ClientTransaction ct1 inner join ClientTransactionPortfolio ctp1 on ct1.Id = ctp1.ClientTransactionId
								inner join TransactionType tt1 on ct1.TransactionTypeId = tt1.Id
								inner join TransactionPlan tp1 on ct1.TransactionPlanId = tp1.Id
								inner join ClientTransactionPortfolioType ctpt1 on ctp1.ClientTransactionPortfolioTypeId = ctpt1.Id
								inner join TransactionPortfolioType tpt1 on ctpt1.TransactionPortfolioTypeId = tpt1.Id
							where ct1.TradeStatus not in ('','In-Complete')
								and (TransactionDate >= DATEADD(MINUTE, -330, CONVERT(datetime, '2026-05-15')) AND TransactionDate < DATEADD(MINUTE, -330, DATEADD(DAY, 1, CONVERT(datetime, '2026-05-15'))))
								and tt1.Code = 'S'
								and tp1.Code = 'L'
								and tpt1.Code = 'A'
								and Amount > 0
						)
					group by ct1.Id
				) as ctp on ct.Id = ctp.ClientTransactionId
				left join (
					select ctp.ClientTransactionId,ctp.PaymentType,isnull(ctpp.ClientTransactionPortfolioId,0) as ClientTransactionPortfolioId
					from ClientTransactionPayment ctp left join ClientTransactionPaymentPortfolio ctpp on ctp.Id = ctpp.ClientTransactionPaymentId
					where ctpp.ClientTransactionPortfolioId is null
					union
					select ctp.ClientTransactionId,ctp.PaymentType,isnull(ctpp.ClientTransactionPortfolioId,0) as ClientTransactionPortfolioId
					from ClientTransactionPaymentMandate ctp left join ClientTransactionPaymentMandatePortfolio ctpp on ctp.Id = ctpp.ClientTransactionPaymentMandateId
					where ctpp.ClientTransactionPortfolioId is null
				) as sctp on ct.Id = sctp.ClientTransactionId
			where ct.TradeStatus not in ('','In-Complete')
				and (TransactionDate >= DATEADD(MINUTE, -330, CONVERT(datetime, @FromDate)) AND TransactionDate < DATEADD(MINUTE, -330, DATEADD(DAY, 1, CONVERT(datetime, @ToDate))))
				and tt.Code = 'S'
				and tp.Code = 'L'
			union all
			select ct.Id,TransactionDate,TransactionTypeId,TransactionPlanId,tt.Name as TransactionTypeName,tt.Code as TransactionTypeCode,
				tp.Name as TransactionPlanName,tp.Code as TransactionPlanCode,
				'' as PaymentType,
				'FSWP' as SubTransactionType,ct.TradeStatus,ctp.Amount
			from ClientTransaction ct inner join TransactionType tt on ct.TransactionTypeId = tt.Id
				inner join TransactionPlan tp on ct.TransactionPlanId = tp.Id
				inner join (
					select ct1.Id as ClientTransactionId, sum(Amount) as Amount
					from ClientTransaction ct1 inner join ClientTransactionPortfolio ctp1 on ct1.Id = ctp1.ClientTransactionId
						inner join TransactionType tt1 on ct1.TransactionTypeId = tt1.Id
						inner join TransactionPlan tp1 on ct1.TransactionPlanId = tp1.Id
					where ct1.TradeStatus not in ('','In-Complete')
						and (TransactionDate >= DATEADD(MINUTE, -330, CONVERT(datetime, @FromDate)) AND TransactionDate < DATEADD(MINUTE, -330, DATEADD(DAY, 1, CONVERT(datetime, @ToDate))))
						and tt1.Code = 'S'
						and tp1.Code = 'FSWP'
					group by ct1.Id
				) as ctp on ct.Id = ctp.ClientTransactionId
				left join (
					select ctp.ClientTransactionId,ctp.PaymentType,isnull(ctpp.ClientTransactionPortfolioId,0) as ClientTransactionPortfolioId
					from ClientTransactionPayment ctp left join ClientTransactionPaymentPortfolio ctpp on ctp.Id = ctpp.ClientTransactionPaymentId
					where ctpp.ClientTransactionPortfolioId is null
					union
					select ctp.ClientTransactionId,ctp.PaymentType,isnull(ctpp.ClientTransactionPortfolioId,0) as ClientTransactionPortfolioId
					from ClientTransactionPaymentMandate ctp left join ClientTransactionPaymentMandatePortfolio ctpp on ctp.Id = ctpp.ClientTransactionPaymentMandateId
					where ctpp.ClientTransactionPortfolioId is null
				) as sctp on ct.Id = sctp.ClientTransactionId
			where ct.TradeStatus not in ('','In-Complete')
				and (TransactionDate >= DATEADD(MINUTE, -330, CONVERT(datetime, @FromDate)) AND TransactionDate < DATEADD(MINUTE, -330, DATEADD(DAY, 1, CONVERT(datetime, @ToDate))))
				and tt.Code = 'S'
				and tp.Code = 'FSWP'
			union all
			select ct.Id,TransactionDate,TransactionTypeId,TransactionPlanId,tt.Name as TransactionTypeName,tt.Code as TransactionTypeCode,
				tp.Name as TransactionPlanName,tp.Code as TransactionPlanCode,
				'' as PaymentType,
				'SWP' as SubTransactionType,ct.TradeStatus,ctp.Amount
			from ClientTransaction ct inner join TransactionType tt on ct.TransactionTypeId = tt.Id
				inner join TransactionPlan tp on ct.TransactionPlanId = tp.Id
				inner join (
					select ct1.Id as ClientTransactionId, sum(SWPAmount) as Amount
					from ClientTransaction ct1 inner join ClientTransactionPortfolio ctp1 on ct1.Id = ctp1.ClientTransactionId
						inner join TransactionType tt1 on ct1.TransactionTypeId = tt1.Id
						inner join TransactionPlan tp1 on ct1.TransactionPlanId = tp1.Id
					where ct1.TradeStatus not in ('','In-Complete')
						and (TransactionDate >= DATEADD(MINUTE, -330, CONVERT(datetime, @FromDate)) AND TransactionDate < DATEADD(MINUTE, -330, DATEADD(DAY, 1, CONVERT(datetime, @ToDate))))
						and tt1.Code = 'S'
						and tp1.Code = 'SWP'
					group by ct1.Id
				) as ctp on ct.Id = ctp.ClientTransactionId
				left join (
					select ctp.ClientTransactionId,ctp.PaymentType,isnull(ctpp.ClientTransactionPortfolioId,0) as ClientTransactionPortfolioId
					from ClientTransactionPayment ctp left join ClientTransactionPaymentPortfolio ctpp on ctp.Id = ctpp.ClientTransactionPaymentId
					where ctpp.ClientTransactionPortfolioId is null
					union
					select ctp.ClientTransactionId,ctp.PaymentType,isnull(ctpp.ClientTransactionPortfolioId,0) as ClientTransactionPortfolioId
					from ClientTransactionPaymentMandate ctp left join ClientTransactionPaymentMandatePortfolio ctpp on ctp.Id = ctpp.ClientTransactionPaymentMandateId
					where ctpp.ClientTransactionPortfolioId is null
				) as sctp on ct.Id = sctp.ClientTransactionId
			where ct.TradeStatus not in ('','In-Complete')
				and (TransactionDate >= DATEADD(MINUTE, -330, CONVERT(datetime, @FromDate)) AND TransactionDate < DATEADD(MINUTE, -330, DATEADD(DAY, 1, CONVERT(datetime, @ToDate))))
				and tt.Code = 'S'
				and tp.Code = 'SWP'
			union all
			select ct.Id,TransactionDate,TransactionTypeId,TransactionPlanId,tt.Name as TransactionTypeName,tt.Code as TransactionTypeCode,
				tp.Name as TransactionPlanName,tp.Code as TransactionPlanCode,
				'' as PaymentType,
				'ASWP' as SubTransactionType,ct.TradeStatus,ctp.Amount
			from ClientTransaction ct inner join TransactionType tt on ct.TransactionTypeId = tt.Id
				inner join TransactionPlan tp on ct.TransactionPlanId = tp.Id
				inner join (
					select ct1.Id as ClientTransactionId, sum(SWPAmount) as Amount
					from ClientTransaction ct1 inner join ClientTransactionPortfolio ctp1 on ct1.Id = ctp1.ClientTransactionId
						inner join ClientTransactionPortfolioType ctpt on ctp1.ClientTransactionPortfolioTypeId = ctpt.Id
						inner join TransactionType tt1 on ct1.TransactionTypeId = tt1.Id
						inner join TransactionPlan tp1 on ct1.TransactionPlanId = tp1.Id
					where ct1.TradeStatus not in ('','In-Complete')
						and (TransactionDate >= DATEADD(MINUTE, -330, CONVERT(datetime, @FromDate)) AND TransactionDate < DATEADD(MINUTE, -330, DATEADD(DAY, 1, CONVERT(datetime, @ToDate))))
						and tt1.Code = 'S'
						and tp1.Code = 'ASWP'
						and ctpt.TransactionPortfolioTypeId in (select Id from TransactionPortfolioType where Code = 'A')
					group by ct1.Id
				) as ctp on ct.Id = ctp.ClientTransactionId
				left join (
					select ctp.ClientTransactionId,ctp.PaymentType,isnull(ctpp.ClientTransactionPortfolioId,0) as ClientTransactionPortfolioId
					from ClientTransactionPayment ctp left join ClientTransactionPaymentPortfolio ctpp on ctp.Id = ctpp.ClientTransactionPaymentId
					where ctpp.ClientTransactionPortfolioId is null
					union
					select ctp.ClientTransactionId,ctp.PaymentType,isnull(ctpp.ClientTransactionPortfolioId,0) as ClientTransactionPortfolioId
					from ClientTransactionPaymentMandate ctp left join ClientTransactionPaymentMandatePortfolio ctpp on ctp.Id = ctpp.ClientTransactionPaymentMandateId
					where ctpp.ClientTransactionPortfolioId is null
				) as sctp on ct.Id = sctp.ClientTransactionId
			where ct.TradeStatus not in ('','In-Complete')
				and (TransactionDate >= DATEADD(MINUTE, -330, CONVERT(datetime, @FromDate)) AND TransactionDate < DATEADD(MINUTE, -330, DATEADD(DAY, 1, CONVERT(datetime, @ToDate))))
				and tt.Code = 'S'
				and tp.Code = 'ASWP'
			union all
			select ct.Id,TransactionDate,TransactionTypeId,TransactionPlanId,tt.Name as TransactionTypeName,tt.Code as TransactionTypeCode,
				tp.Name as TransactionPlanName,tp.Code as TransactionPlanCode,
				'' as PaymentType,
				'NA' as SubTransactionType,ct.TradeStatus,0 as Amount
			from ClientTransaction ct inner join TransactionType tt on ct.TransactionTypeId = tt.Id
				inner join TransactionPlan tp on ct.TransactionPlanId = tp.Id
			where ct.TradeStatus not in ('','In-Complete')
				and (TransactionDate >= DATEADD(MINUTE, -330, CONVERT(datetime, @FromDate)) AND TransactionDate < DATEADD(MINUTE, -330, DATEADD(DAY, 1, CONVERT(datetime, @ToDate))))
				and tt.Code = 'SW'
				and tp.Code = 'IS'
			union all
			select ct.Id,TransactionDate,TransactionTypeId,TransactionPlanId,tt.Name as TransactionTypeName,tt.Code as TransactionTypeCode,
				tp.Name as TransactionPlanName,tp.Code as TransactionPlanCode,
				'' as PaymentType,
				'NA' as SubTransactionType,ct.TradeStatus,0 as Amount
			from ClientTransaction ct inner join TransactionType tt on ct.TransactionTypeId = tt.Id
				inner join TransactionPlan tp on ct.TransactionPlanId = tp.Id
			where ct.TradeStatus not in ('','In-Complete')
				and (TransactionDate >= DATEADD(MINUTE, -330, CONVERT(datetime, @FromDate)) AND TransactionDate < DATEADD(MINUTE, -330, DATEADD(DAY, 1, CONVERT(datetime, @ToDate))))
				and tt.Code = 'SW'
				and tp.Code = 'STP'
			union all
			select ct.Id,TransactionDate,TransactionTypeId,TransactionPlanId,tt.Name as TransactionTypeName,tt.Code as TransactionTypeCode,
				tp.Name as TransactionPlanName,tp.Code as TransactionPlanCode,
				'' as PaymentType,
				'NA' as SubTransactionType,ct.TradeStatus,0 as Amount
			from ClientTransaction ct inner join TransactionType tt on ct.TransactionTypeId = tt.Id
				inner join TransactionPlan tp on ct.TransactionPlanId = tp.Id
			where ct.TradeStatus not in ('','In-Complete')
				and (TransactionDate >= DATEADD(MINUTE, -330, CONVERT(datetime, @FromDate)) AND TransactionDate < DATEADD(MINUTE, -330, DATEADD(DAY, 1, CONVERT(datetime, @ToDate))))
				and tt.Code = 'C'
				and tp.Code in ('SIP','STP','SWP')
		) as ct
		left join (
			select ClientTransactionId,ClientAccountId
			from (
				select row_number() over(partition by ClientTransactionId order by ClientTransactionId) as RecordNo,ClientTransactionId,ClientAccountId
				from ClientTransactionAccount
			) as ctna
			where RecordNo = 1
		) as cta on ct.Id = cta.ClientTransactionId
		left join (
			select ca.Id,cf.Name,ca.UCC,ckp.PANCardNumber,isnull(cae.EmployeeId,0) as EmployeeId
			from ClientAccount ca inner join ClientAccountHolder cah on ca.Id = cah.ClientAccountId
				inner join ClientKycProfile ckp on cah.ClientKycProfileId = ckp.Id
				inner join ClientKycProfileFamily ckpf on ckp.Id = ckpf.ClientKycProfileId
				inner join ClientFamily cf on ckpf.ClientFamilyId = cf.Id
				left join ClientAssociateEmployee cae on ca.ClientId = cae.ClientId
			where cah.SerialNumber = 1
			union all
			select ca.Id,cf.Name,ca.UCC,ckp.PANCardNumber,isnull(cae.EmployeeId,0) as EmployeeId
			from ClientAccount ca inner join ClientAccountHolder cah on ca.Id = cah.ClientAccountId
				inner join ClientKycProfile ckp on cah.ClientKycProfileId = ckp.Id
				inner join ClientKycProfileCompany ckpf on ckp.Id = ckpf.ClientKycProfileId
				inner join ClientCompany cf on ckpf.ClientCompanyId = cf.Id
				left join ClientAssociateEmployee cae on ca.ClientId = cae.ClientId
			where cah.SerialNumber = 1
		) as cas on cta.ClientAccountId = cas.Id
		left join ClientAccount ca on cta.ClientAccountId = ca.Id
		left join (
			select ClientTransactionId,FirstHolderName,PANCardNumber
			from (
				select row_number() over(partition by ClientTransactionId order by ClientTransactionId) as RecordNo,ClientTransactionId,na.FirstHolderName,(case isnull(ft.FirstHolderPan,'') when '' then isnull(ft.GuardianPan,'') else isnull(ft.FirstHolderPan,'') end) as PANCardNumber
				from ClientTransactionNonAccount na left join (
					select distinct FirstHolderName,SecondHolderName,ThirdHolderName,GuardianName,Nominee1FLName,Nominee2FLName,Nominee3FLName,
						FirstHolderPan,SecondHolderPan,ThirdHolderPan,GuardianPan
					from FeedTransactionUccFolio
				) as ft on na.FirstHolderName = ft.FirstHolderName and na.SecondHolderName = ft.SecondHolderName and na.ThirdHolderName = ft.ThirdHolderName 
					and na.GuardianName = ft.GuardianName and na.FirstNomineeName = ft.Nominee1FLName and na.SecondNomineeName = ft.Nominee2FLName and na.ThirdNomineeName = ft.Nominee3FLName
			) as ctna
			where RecordNo = 1
		) as ctna on ct.Id = ctna.ClientTransactionId
		left join Client c on ca.ClientId = c.Id
		left join Associate a on c.AssociateId = a.Id
	where c.AssociateId = (case @AssociateId when 0 then c.AssociateId else @AssociateId end)
		and isnull(cas.PANCardNumber,isnull(ctna.PANCardNumber,'')) = (case @PANCardNumber when '' then isnull(cas.PANCardNumber,isnull(ctna.PANCardNumber,'')) else @PANCardNumber end)
	union
	select f.Id,f.td_trdt as TransactionDate,0 as TransactionTypeId,0 as TransactionPlanId,f.td_amt as Amount,isnull(tt.TransactionTypeName,'') as TransactionTypeName,
		'' as TransactionTypeCode,'' as TransactionPlanName,'' as TransactionPlanCode,
		'' as PaymentType,'' as SubTransactionType,'Completed' as TradeStatus,
		0 as ClientAccountId,ft.FirstHolderName as ClientName,ft.Ucc as UCC,(case isnull(ft.FirstHolderPan,'') when '' then isnull(ft.GuardianPan,'') else isnull(ft.FirstHolderPan,'') end) as PANCardNumber,
		(case isnull(a.EntityName,'') when '' then isnull(a.Name,'') else isnull(a.EntityName,'') end) as AssociateName,'FK' as RecordType,'' as TradeType,
		td_acno as FolioNumber,funddesc as SchemeName,inwardnum1 as TransactionId,td_nav as NAV,td_units as Units,td_prdt as TransactionCompletedDate,
		0 as EmployeeId
	from FeedKarvy307 f inner join FeedTransactionUccFolio ft on f.td_acno = ft.FolioNumber and f.fmcode = ft.ProductCode
		left join TransactionTypeKarvy tt on f.trdesc = tt.KarvyTransactionType and f.td_purred = tt.KarvyTransactionNature
		left join Associate a on ft.SubBrokerCode = '19941' + a.AssociateCode
	where (f.td_trdt between @FromDate and @ToDate)
		and f.inwardnum1 not in (
			select BSEOrderId
			from ClientTransactionAllocation
			where BSEOrderId not in ('','0')
		)
		and ft.SubBrokerCode = (case @AssociateCode when '' then ft.SubBrokerCode else @AssociateCode end)
		and (case isnull(ft.FirstHolderPan,'') when '' then isnull(ft.GuardianPan,'') else isnull(ft.FirstHolderPan,'') end) = (case @PANCardNumber when '' then (case isnull(ft.FirstHolderPan,'') when '' then isnull(ft.GuardianPan,'') else isnull(ft.FirstHolderPan,'') end) else @PANCardNumber end)
	union
	select f.Id,f.traddate as TransactionDate,0 as TransactionTypeId,0 as TransactionPlanId,f.amount as Amount,isnull(tt.TransactionTypeName,'') as TransactionTypeName,
		'' as TransactionTypeCode,'' as TransactionPlanName,'' as TransactionPlanCode,
		'' as PaymentType,'' as SubTransactionType,'Completed' as TradeStatus,
		0 as ClientAccountId,ft.FirstHolderName as ClientName,ft.Ucc as UCC,(case isnull(ft.FirstHolderPan,'') when '' then isnull(ft.GuardianPan,'') else isnull(ft.FirstHolderPan,'') end) as PANCardNumber,
		(case isnull(a.EntityName,'') when '' then isnull(a.Name,'') else isnull(a.EntityName,'') end) as AssociateName,'FC' as RecordType,'' as TradeType,
		folio_no as FolioNumber,scheme as SchemeName,scanrefno as TransactionId,purprice as NAV,units as Units,postdate as TransactionCompletedDate,
		0 as EmployeeId
	from FeedCamsWbr2 f inner join FeedTransactionUccFolio ft on f.folio_no = ft.FolioNumber and f.prodcode = ft.ProductCode
		left join TransactionTypeCams tt on f.trxntype = tt.CamsTransactionType and f.trxn_natur = tt.CamsTransactionNature
		left join Associate a on ft.SubBrokerCode = '19941' + a.AssociateCode
	where (f.traddate between @FromDate and @ToDate)
		and f.scanrefno not in (
			select BSEOrderId
			from ClientTransactionAllocation
			where BSEOrderId not in ('','0')
		)
		and ft.SubBrokerCode = (case @AssociateCode when '' then ft.SubBrokerCode else @AssociateCode end)
		and (case isnull(ft.FirstHolderPan,'') when '' then isnull(ft.GuardianPan,'') else isnull(ft.FirstHolderPan,'') end) = (case @PANCardNumber when '' then (case isnull(ft.FirstHolderPan,'') when '' then isnull(ft.GuardianPan,'') else isnull(ft.FirstHolderPan,'') end) else @PANCardNumber end)
	union
	select f.Id,f.traddate as TransactionDate,0 as TransactionTypeId,0 as TransactionPlanId,f.amount as Amount,isnull(tt.TransactionTypeName,'') as TransactionTypeName,
		'' as TransactionTypeCode,'' as TransactionPlanName,'' as TransactionPlanCode,
		'' as PaymentType,'' as SubTransactionType,'Completed' as TradeStatus,
		0 as ClientAccountId,ft.FirstHolderName as ClientName,ft.Ucc as UCC,(case isnull(ft.FirstHolderPan,'') when '' then isnull(ft.GuardianPan,'') else isnull(ft.FirstHolderPan,'') end) as PANCardNumber,
		(case isnull(a.EntityName,'') when '' then isnull(a.Name,'') else isnull(a.EntityName,'') end) as AssociateName,'FC2' as RecordType,'' as TradeType,
		folio_no as FolioNumber,scheme as SchemeName,scanrefno as TransactionId,purprice as NAV,units as Units,postdate as TransactionCompletedDate,
		0 as EmployeeId
	from FeedCamsWbr2a f inner join FeedTransactionUccFolio ft on f.folio_no = ft.FolioNumber and f.prodcode = ft.ProductCode
		left join TransactionTypeCams tt on f.trxntype = tt.CamsTransactionType and f.trxn_natur = tt.CamsTransactionNature
		left join Associate a on ft.SubBrokerCode = '19941' + a.AssociateCode
	where (f.traddate between @FromDate and @ToDate)
		and f.scanrefno not in (
			select BSEOrderId
			from ClientTransactionAllocation
			where BSEOrderId not in ('','0')
		)
		and ft.SubBrokerCode = (case @AssociateCode when '' then ft.SubBrokerCode else @AssociateCode end)
		and (case isnull(ft.FirstHolderPan,'') when '' then isnull(ft.GuardianPan,'') else isnull(ft.FirstHolderPan,'') end) = (case @PANCardNumber when '' then (case isnull(ft.FirstHolderPan,'') when '' then isnull(ft.GuardianPan,'') else isnull(ft.FirstHolderPan,'') end) else @PANCardNumber end)
	order by TransactionDate desc
