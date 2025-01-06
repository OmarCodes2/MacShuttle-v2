import { BOARDED, NOT_BOARDED } from "../constants/shuttles/statuses"
import BottomSheetBlock from "./bottom-sheet/bottomSheetBlock"
import BottomSheetTitle from "./bottom-sheet/bottomSheetTitle"
import BottomSheetWrapper from "./bottom-sheet/bottomSheetWrapper"
import BoardShuttleButton from "./buttons/boardShuttleButton"
import CloseButton from "./buttons/closeButton"

const UpcomingStopsSheet = ({
  handleClose,
  handleBoard,
  selectedShuttle,
  boardedShuttle,
  stopsData,
}) => {
  return (
    <BottomSheetWrapper>
      <CloseButton onPress={handleClose} />
      <BottomSheetTitle
        title={`${selectedShuttle}`}
        subtitle="Upcoming stops"
      />
      <BoardShuttleButton
        status={boardedShuttle === selectedShuttle ? BOARDED : NOT_BOARDED}
        onPress={handleBoard}
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
