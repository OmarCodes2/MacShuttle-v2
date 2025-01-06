import { BOARDED, NOT_BOARDED } from "../constants/shuttles/statuses"
import BottomSheetBlock from "./bottom-sheet/bottomSheetBlock"
import BottomSheetTitle from "./bottom-sheet/bottomSheetTitle"
import BottomSheetWrapper from "./bottom-sheet/bottomSheetWrapper"
import BoardShuttleButton from "./buttons/boardShuttleButton"

const UpcomingStopsSheet = ({
  handleBoard,
  selectedShuttle,
  boardedShuttle,
  stopsData,
}) => {
  return (
    <BottomSheetWrapper>
      <BottomSheetTitle
        title={`${selectedShuttle}`}
        subtitle="Upcoming stops"
      />
      <BoardShuttleButton
        status={boardedShuttle === selectedShuttle ? BOARDED : NOT_BOARDED}
        onPress={() => handleBoard(selectedShuttle)}
      />
      {stopsData.map((stopsData) => {
        return (
          <BottomSheetBlock
            key={stopsData[0]}
            leftText={stopsData[0]}
            rightText={`${stopsData[1]} min`}
          />
        )
      })}
    </BottomSheetWrapper>
  )
}

export default UpcomingStopsSheet
