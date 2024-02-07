CREATE TABLE [dbo].[NarrowSet_IllustrationGroup_rel](
	[CatalogID] [int] NOT NULL,
	[NarrowSetSequenceID] [int] NOT NULL,
	[SectionID] [int] NOT NULL,
	[IllustrationGroupID] [int] NOT NULL,
	[IllustrationGroupImageID] [int] NOT NULL,
	[SerialNumberFlag] [bit] NULL,
	[ChartFlag] [bit] NULL
) ON [PRIMARY]
GO

CREATE UNIQUE CLUSTERED INDEX [IX_NarrowSet_IllustrationGroup_rel] ON [dbo].[NarrowSet_IllustrationGroup_rel]
(
	[CatalogID] ASC,
	[NarrowSetSequenceID] ASC,
	[SectionID] ASC,
	[IllustrationGroupID] ASC,
	[IllustrationGroupImageID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, FILLFACTOR = 90) ON [PRIMARY]
GO

CREATE NONCLUSTERED INDEX [IX_NarrowSet_IllustrationGroup_rel_1] ON [dbo].[NarrowSet_IllustrationGroup_rel]
(
	[IllustrationGroupID] ASC,
	[IllustrationGroupImageID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, FILLFACTOR = 90) ON [PRIMARY]
GO

CREATE NONCLUSTERED INDEX [IX_NarrowSet_IllustrationGroup_rel_2] ON [dbo].[NarrowSet_IllustrationGroup_rel]
(
	[CatalogID] ASC,
	[NarrowSetSequenceID] ASC,
	[SectionID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, FILLFACTOR = 90) ON [PRIMARY]
GO