-- =============================================
-- Author:		Md Abul Kalam
-- Create date: 18 Sept, 2020
-- Description:	SP for getting Emission and Transmission list of vehicles
-- =============================================

CREATE PROCEDURE [dbo].[vehicles_Area_Transmission_GetEmissionAndTransmission]
	@MODELID INT,
	@YEARID INT,
	@DOORID INT,
	@GRADEID INT
AS
	SET NOCOUNT ON;
	SELECT DISTINCT  Convert(VARCHAR(20), A.[ID]) + ',' + Convert(VARCHAR(20), T.[ID]) AS ID,
		   A.[Description] + ' ' + T.[Description] AS Description
	FROM ModelMaster MM WITH (NOLOCK)
	INNER JOIN Area A WITH (NOLOCK)
	ON MM.AreaID = A.ID
	INNER JOIN Transmission T WITH (NOLOCK)
	ON MM.TransmissionID = T.ID
	WHERE MM.ProductID = @MODELID
	AND MM.YearID = @YEARID
	AND MM.DoorID = @DOORID
	AND MM.GradeID = @GRADEID
	AND A.[EffectiveDate] <= GETDATE()
	AND T.[EffectiveDate] <= GETDATE()
	ORDER BY Description
RETURN 0