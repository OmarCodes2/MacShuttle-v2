import BottomSheetBlock from "./bottom-sheet/bottomSheetBlock"
import BottomSheetTitle from "./bottom-sheet/bottomSheetTitle"
import BottomSheetWrapper from "./bottom-sheet/bottomSheetWrapper"
import BoardShuttleButton from "./buttons/boardShuttleButton"

const UpcomingStopsSheet = ({
  handleExit,
  handleBoard,
  selectedShuttle,
  boardedShuttle,
  stopsData,
}) => {
  return (
    <BottomSheetWrapper>
      <BottomSheetTitle
        title={`Shuttle: ${selectedShuttle}`}
        subtitle="Upcoming stops"
      />
      <BoardShuttleButton
        status={boardedShuttle === selectedShuttle}
        onPress={handleBoard}
      />
      {stopsData.map((stopsData) => {
        return (
          <BottomSheetBlock
            key={stopsData[0]}
            leftText={stopsData[0]}
            rightText={`${stopsData[1]} min`}
            clickable={true}
            onPress={() => handleShuttleSelect(stopsData[0])}
          />
        )
      })}
    </BottomSheetWrapper>
  )
}

export default UpcomingStopsSheet
