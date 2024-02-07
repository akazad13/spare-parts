CREATE TABLE [dbo].[ModelMaster](
	[CatalogID] INT NOT NULL,
	[ProductID] INT NOT NULL,
	[DoorID] INT NOT NULL,
	[YearID] INT NOT NULL,
	[GradeID] INT NOT NULL,
	[AreaID] INT NOT NULL,
	[OriginID] INT NOT NULL,
	[TransmissionID] INT NOT NULL,
	[ColorLabelID] INT NOT NULL,
	[ColorNameID] INT NOT NULL,
	[SerialTypeCode] VARCHAR(10) NOT NULL,
	[SerialCheckCode] VARCHAR(10) NOT NULL,
	[SerialHighCode] VARCHAR(20) NOT NULL,
	[SerialLowCode] VARCHAR(20) NOT NULL,
	[EngineTypeCode] VARCHAR(10) NOT NULL,
	[EngineHighCode] VARCHAR(20) NOT NULL,
	[EngineLowCode] VARCHAR(20) NOT NULL,
	[TransmissiontypeCode] VARCHAR(10) NOT NULL,
	[TransmissionHighCode] VARCHAR(20) NOT NULL,
	[TransmissionLowCode] VARCHAR(20) NOT NULL,
	[ModelNameText] VARCHAR(50) NOT NULL,
	[HSCode] VARCHAR(20) NULL
)
GO
ALTER TABLE [dbo].[ModelMaster] ADD  CONSTRAINT [DF_ModelMaster_SerialTypeCode]  DEFAULT ('') FOR [SerialTypeCode]
GO
ALTER TABLE [dbo].[ModelMaster] ADD  CONSTRAINT [DF_ModelMaster_SerialCheckCode]  DEFAULT ('') FOR [SerialCheckCode]
GO
ALTER TABLE [dbo].[ModelMaster] ADD  CONSTRAINT [DF_ModelMaster_SerialHighCode]  DEFAULT ('') FOR [SerialHighCode]
GO
ALTER TABLE [dbo].[ModelMaster] ADD  CONSTRAINT [DF_ModelMaster_SerialLowCode]  DEFAULT ('') FOR [SerialLowCode]
GO
ALTER TABLE [dbo].[ModelMaster] ADD  CONSTRAINT [DF_ModelMaster_EngineTypeCode]  DEFAULT ('') FOR [EngineTypeCode]
GO
ALTER TABLE [dbo].[ModelMaster] ADD  CONSTRAINT [DF_ModelMaster_EngineHighCode]  DEFAULT ('') FOR [EngineHighCode]
GO
ALTER TABLE [dbo].[ModelMaster] ADD  CONSTRAINT [DF_ModelMaster_EngineLowCode]  DEFAULT ('') FOR [EngineLowCode]
GO
ALTER TABLE [dbo].[ModelMaster] ADD  CONSTRAINT [DF_ModelMaster_TransmissiontypeCode]  DEFAULT ('') FOR [TransmissiontypeCode]
GO
ALTER TABLE [dbo].[ModelMaster] ADD  CONSTRAINT [DF_ModelMaster_TransmissionHighCode]  DEFAULT ('') FOR [TransmissionHighCode]
GO
ALTER TABLE [dbo].[ModelMaster] ADD  CONSTRAINT [DF_ModelMaster_TransmissionLowCode]  DEFAULT ('') FOR [TransmissionLowCode]
GO

CREATE CLUSTERED INDEX IX_ModelMaster   
ON [dbo].[ModelMaster]
(
	[GradeID] ASC,
	[CatalogID] ASC,
	[ColorLabelID] ASC,
	[YearID] ASC,
	[ProductID] ASC,
	[DoorID] ASC,
	[AreaID] ASC,
	[OriginID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, FILLFACTOR = 90) ON [PRIMARY]
GO