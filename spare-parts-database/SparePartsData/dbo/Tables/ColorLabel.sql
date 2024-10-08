﻿CREATE TABLE [dbo].[ColorLabel]
(
	[ID] INT CONSTRAINT PK_ColorLabel PRIMARY KEY CLUSTERED (ID),
	[Description] VARCHAR(60) NOT NULL,
	[EffectiveDate] DATETIME NOT NULL CONSTRAINT DF_ColorLabel_EffectiveDate DEFAULT(GETDATE()),
	[DateLastUpdated] DATETIME NOT NULL CONSTRAINT DF_ColorLabel_DateLastUpdated DEFAULT(GETDATE()),
	[UserIDLastUpdated] BIGINT NOT NULL CONSTRAINT DF_ColorLabel_UserIDLastUpdated DEFAULT(0)
)
