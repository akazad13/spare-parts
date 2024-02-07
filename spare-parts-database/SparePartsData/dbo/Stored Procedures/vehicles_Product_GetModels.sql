-- =============================================
-- Author:		Md Abul Kalam
-- Create date: 18 Sept, 2020
-- Description:	SP for getting Product model list
-- =============================================

CREATE PROCEDURE [dbo].[vehicles_Product_GetModels]
AS
	SET NOCOUNT ON;
	SELECT [ID], [Description] AS Description, [EffectiveDate], [DateLastUpdated]
	FROM Product WITH (NOLOCK)
	WHERE [EffectiveDate] <= GETDATE()
	ORDER BY [Description];
RETURN 0
