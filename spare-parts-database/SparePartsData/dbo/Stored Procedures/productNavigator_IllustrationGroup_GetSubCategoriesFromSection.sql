-- =============================================
-- Author:		Md Abul Kalam
-- Create date: 30 Oct, 2020
-- Description:	SP for fetching the list of subcategory
-- =============================================
CREATE PROCEDURE [dbo].[productNavigator_IllustrationGroup_GetSubCategoriesFromSection]
	@ProductID AS INT=0,
	@DoorID AS INT=0,
	@YearID	AS INT=0,
	@GradeID AS INT=0,
	@CatalogID AS INT=0,
	@AreaID AS INT=0,
	@OriginID AS INT=0,
	@TransmissionID AS INT=0,
	@ColorLabelID AS INT=0,
	@ColorNameID AS INT=0,
	@SectionID AS INT=0
AS
BEGIN
	SET  NOCOUNT ON
		
	SELECT DISTINCT
		ig.ID, 
		ig.Code, 
		ig.Description, 	
		nigr.SectionID,
		s.Description AS SectionDescription,	 
		nigr.IllustrationGroupImageID,
		nigr.IllustrationGroupID,
		nigr.SerialNumberFlag, 
		nigr.ChartFlag
	FROM NarrowSet_rel ns WITH (NOLOCK)
	INNER JOIN NarrowSet_IllustrationGroup_rel nigr WITH (NOLOCK)
	ON  nigr.CatalogID = ns.CatalogID
	AND nigr.NarrowSetSequenceID = ns.NarrowSetSequenceID
	INNER JOIN IllustrationGroup ig WITH (NOLOCK)
	ON ig.CatalogID = ns.CatalogID
	AND ig.ID = nigr.IllustrationGroupID	
	INNER JOIN Section s WITH (NOLOCK)
	ON s.ID = nigr.SectionID
	WHERE
		ns.ProductID = @ProductID
	AND ns.DoorID = @DoorID
	AND ns.YearID = @YearID
	AND ((ns.GradeID = @GradeID) OR (@GradeID = 0))
	AND ((ns.CatalogID = @CatalogID) OR (@CatalogID = 0))
	AND ((ns.AreaID = @AreaID) OR (@AreaID = 0))
	AND ((ns.OriginID = @OriginID) OR (@OriginID = 0))
	AND ((ns.TransmissionID = @TransmissionID) OR (@TransmissionID = 0))
	--AND ((a.ColorLabelID = @ColorLabelID) OR ((@ColorLabelID = 0) OR (a.ColorLabelID = 0)))	
	AND nigr.SectionID	= @SectionID
	ORDER BY
		ig.Code
END