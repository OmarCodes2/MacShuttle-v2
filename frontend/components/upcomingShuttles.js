import BottomSheetBlock from "./bottom-sheet/bottomSheetBlock"
import BottomSheetTitle from "./bottom-sheet/bottomSheetTitle"
import BottomSheetWrapper from "./bottom-sheet/bottomSheetWrapper"

const UpcomingShuttlesSheet = ({
  handleShuttleSelect,
  nearestStop,
  busDataList,
}) => {
  return (
    <BottomSheetWrapper>
      <BottomSheetTitle
        title={`Nearest Stop: ${nearestStop}`}
        subtitle="Upcoming shuttles"
      />
      {busDataList.map((busData) => {
        return (
          <BottomSheetBlock
            key={busData[0]}
            leftText={busData[0]}
            rightText={`${busData[1]} min`}
            clickable={true}
            onPress={() => handleShuttleSelect(busData[0])}
          />
        )
      })}
    </BottomSheetWrapper>
  )
}

export default UpcomingShuttlesSheet
