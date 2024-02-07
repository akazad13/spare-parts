-- =============================================
-- Author:		Md Abul Kalam
-- Create date: 18 Sept, 2020
-- Description:	SP for getting Body and Trims list of vehicles
-- =============================================

CREATE PROCEDURE [dbo].[vehicles_Door_Grade_GetBodyAndTrims]
	@MODELID INT,
	@YEARID INT
AS
	SET NOCOUNT ON;
	SELECT DISTINCT  Convert(VARCHAR(20), D.[ID]) + ',' + Convert(VARCHAR(20), G.[ID]) AS ID,
		   D.[Description] + ' Door ' + G.[Description] AS Description
	FROM ModelMaster MM WITH (NOLOCK)
	INNER JOIN Door D WITH (NOLOCK)
	ON MM.DoorID = D.ID
	INNER JOIN Grade G WITH (NOLOCK)
	ON MM.GradeID = G.ID
	WHERE MM.ProductID = @MODELID
	AND MM.YearID = @YEARID
	AND D.[EffectiveDate] <= GETDATE()
	AND G.[EffectiveDate] <= GETDATE()
	ORDER BY Description
RETURN 0
