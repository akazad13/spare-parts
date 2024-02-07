CREATE TABLE [dbo].[Transmission]
(
	[ID] INT CONSTRAINT PK_Transmission PRIMARY KEY CLUSTERED (ID),
	[Description] VARCHAR(10) NOT NULL,
	[EffectiveDate] DATETIME NOT NULL CONSTRAINT DF_Transmission_EffectiveDate DEFAULT(GETDATE()),
	[DateLastUpdated] DATETIME NOT NULL CONSTRAINT DF_Transmission_DateLastUpdated DEFAULT(GETDATE()),
	[UserIDLastUpdated] BIGINT NOT NULL CONSTRAINT DF_Transmission_UserIDLastUpdated DEFAULT(0)
)
