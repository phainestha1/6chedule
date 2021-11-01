const today = new Date();
const year = today.getFullYear();
const month = today.getMonth() + 1;
const day = today.getDate();
const calendar = `${year}년 ${month}월 ${day}일`;

export default calendar;
