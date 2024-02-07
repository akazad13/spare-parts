﻿CREATE TABLE [dbo].[Narrowset_rel]
(
	[CatalogID] INT NOT NULL,
	[NarrowSetSequenceID] INT NOT NULL,
	[ProductID] INT NOT NULL,
	[GradeID] INT NOT NULL,
	[DoorID] INT NOT NULL,
	[YearID] INT NOT NULL,
	[AreaID] INT NOT NULL,
	[OriginID] INT NOT NULL,
	[TransmissionID] INT NOT NULL,
	[ColorLabelID] INT NOT NULL,
	[ColorNameID] INT NOT NULL,
	[IBFlag] BIT NULL,
	CONSTRAINT [IX_Narrowset_rel] UNIQUE CLUSTERED 
	(
		[ProductID] ASC,
		[YearID] ASC,
		[DoorID] ASC,
		[GradeID] ASC,
		[CatalogID] ASC,
		[AreaID] ASC,
		[OriginID] ASC,
		[TransmissionID] ASC,
		[ColorLabelID] ASC,
		[ColorNameID] ASC,
		[NarrowSetSequenceID] ASC
	)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, FILLFACTOR = 90) ON [PRIMARY],
	INDEX  [IX_Narrowset_rel_1] NONCLUSTERED 
	(
		[CatalogID],
		[NarrowSetSequenceID]
	)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, FILLFACTOR = 90) ON [PRIMARY]
) ON [PRIMARY]
GO