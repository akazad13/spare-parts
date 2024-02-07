CREATE TABLE [dbo].[ExpiredKeys] (
    [ExpiredKey] VARCHAR (255) NOT NULL,
    [LogoutTime] DATETIME      NULL,
    CONSTRAINT PK_ExpiredKeys PRIMARY KEY CLUSTERED ([ExpiredKey] ASC)
);

