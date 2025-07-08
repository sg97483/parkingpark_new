// state
export const getRouteStateValue = (value: string) => {
  switch (value) {
    case 'N':
      return '등록완료'; //Not applied status
    case 'C':
      return '카풀 신청상태'; // Carpool application status
    case 'P':
      return '수락상태'; // Accepted status
    case 'E':
      return '카풀완료'; // Ended status
    default:
      return '등록예정';
  }
};

//rStatusCheck
export const carpoolStatusValue = (value: string) => {
  switch (value) {
    case 'R':
      return '예약완료'; //payment completed
    case 'O':
      return '운행중'; // boarding completed // running
    case 'E':
      return '카풀완료'; // end
    case 'N':
    case 'A':
      return '등록완료'; // registration completed
    case 'C':
      return '예약취소'; // Cancellation complete
    case 'P':
      return '패널티부과'; // Penalty
    default:
      return '';
  }
};
