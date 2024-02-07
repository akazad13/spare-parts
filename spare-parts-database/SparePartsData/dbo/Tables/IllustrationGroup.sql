CREATE TABLE [dbo].[IllustrationGroup](
	[ID] INT NOT NULL,
	[CatalogID] INT NOT NULL,
	[Code] VARCHAR(10) NOT NULL,
	[Description] VARCHAR(75) NOT NULL,
	[EffectiveDate] DATETIME NOT NULL,
	[DateLastUpdated] DATETIME NOT NULL,
	[UserIDLastUpdated] INT NOT NULL
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[IllustrationGroup] ADD  CONSTRAINT [DF_IllustrationGroup_EffectiveDate]  DEFAULT (getdate()) FOR [EffectiveDate]
GO

ALTER TABLE [dbo].[IllustrationGroup] ADD  CONSTRAINT [DF_IllustrationGroup_DateLastUpdated]  DEFAULT (getdate()) FOR [DateLastUpdated]
GO

ALTER TABLE [dbo].[IllustrationGroup] ADD  CONSTRAINT [DF_IllustrationGroup_UserIDLastUpdated]  DEFAULT (0) FOR [UserIDLastUpdated]
GO

CREATE NONCLUSTERED INDEX [IX_IllustrationGroup_CatalogID] ON [dbo].[IllustrationGroup]
(
	[CatalogID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, FILLFACTOR = 90) ON [PRIMARY]
GO

CREATE UNIQUE CLUSTERED INDEX [IX_IllustrationGroup_ID] ON [dbo].[IllustrationGroup]
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = ON, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, FILLFACTOR = 90) ON [PRIMARY]
GO