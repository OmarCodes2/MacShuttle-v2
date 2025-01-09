import BottomSheetBlock from "./bottom-sheet/bottomSheetBlock"
import BottomSheetTitle from "./bottom-sheet/bottomSheetTitle"
import BottomSheetWrapper from "./bottom-sheet/bottomSheetWrapper"
import ViewStopButton from "./buttons/viewStopButton"

const UpcomingShuttlesSheet = ({
  handleOpenShuttle,
  handleViewStop,
  stop,
  busDataList,
}) => {
  return (
    <BottomSheetWrapper>
      <BottomSheetTitle
        title={`Stop: ${stop}`}
        subtitle="Upcoming shuttles"
        ButtonComponent={() => <ViewStopButton onPress={handleViewStop} />}
      />
      {busDataList.map((busData) => {
        return (
          <BottomSheetBlock
            key={busData[0]}
            leftText={busData[0]}
            rightText={`${busData[1]} min`}
            clickable={true}
            onPress={() => handleOpenShuttle(busData[0])}
          />
        )
      })}
    </BottomSheetWrapper>
  )
}

export default UpcomingShuttlesSheet
