CREATE TABLE [dbo].[UserAddress] (
    [Id]          BIGINT        IDENTITY (1, 1) NOT NULL,
    [FirstName]   VARCHAR (50)  NOT NULL,
    [LastName]    VARCHAR (50)  NOT NULL,
    [CompanyName] VARCHAR (100) NULL,
    [Country]     VARCHAR (50)  NOT NULL,
    [Address]     VARCHAR (255) NOT NULL,
    [City]        VARCHAR (50)  NOT NULL,
    [State]       VARCHAR (50)  NULL,
    [Postcode]    INT           NULL,
    [Email]       VARCHAR (100) NOT NULL,
    [Phone]       VARCHAR (50)  NOT NULL,
    [AddressType] TINYINT       NOT NULL,
    [CreatedBy]   BIGINT        NULL,
    [CreatedOn]   DATETIME      NULL,
    [ModifiedBy]  BIGINT        NULL,
    [ModifiedOn]  DATETIME      NULL,
    [UserId]      BIGINT        NOT NULL,
    CONSTRAINT PK_UserAddress PRIMARY KEY ([Id] ASC),
    CONSTRAINT [FK_UserAddress_USER_Id] FOREIGN KEY ([UserId]) REFERENCES [dbo].[User] ([Id]) ON DELETE CASCADE ON UPDATE CASCADE
);
GO
CREATE NONCLUSTERED INDEX [IX_UserAddress] ON [dbo].[UserAddress]
(
	[UserId]
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, FILLFACTOR = 90) ON [PRIMARY]
GO

