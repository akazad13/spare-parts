-- =============================================
-- Author:		Md Abul Kalam
-- Create date: 18 Sept, 2020
-- Description:	SP for getting Year by Model
-- =============================================


CREATE PROCEDURE [dbo].[vehicles_Year_GetYearsByProductModel]
	@MODELID INT
AS
	SET NOCOUNT ON;
	SELECT DISTINCT Y.[Description], Y.[ID]
	FROM Year Y WITH (NOLOCK) 
	INNER JOIN ModelMaster MM WITH (NOLOCK) 
	ON Y.ID = MM.YearID
	WHERE MM.ProductID = @MODELID
	AND Y.[EffectiveDate] <= GETDATE()
	ORDER BY Y.[Description] DESC;
RETURN 0
