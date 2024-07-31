import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { ShitInformation, updateBooking } from "../../redux/MovieReducer";
import "./BooKing.css";
import axios from "axios";
import data from "./../../json/data.json";
const BookingMovie = () => {
  const { booking } = useSelector(ShitInformation);
  const [chosenPos, setChosenPos] = useState(
    new Array(10).fill(new Array(12).fill(false))
  );
  console.log("chosenpos:", chosenPos);
  const dispatch = useDispatch();
  let pickedArr = [];
  const tableStyle = {
    borderCollapse: "collapse",
    width: "100%",
  };

  const thStyle = {
    border: "1px solid black",
    padding: "8px",
  };

  const tdStyle = {
    border: "1px solid black",
    padding: "8px",
  };
  useEffect(() => {
    const getDataProcessor = async () => {
      try {
        const dataFromLocal = localStorage.getItem("booking");
        console.log(dataFromLocal);
        if (!dataFromLocal) {
          console.log(data);
          dispatch(updateBooking(data));
        } else {
          dispatch(updateBooking(JSON.parse(dataFromLocal)));
        }
      } catch (error) {
        console.log("error from getting local booking information!", error);
      }
    };
    getDataProcessor();
  }, []);

  const renderRowNumber = () => {
    console.log(booking.length);
    if (booking.length != 0) {
      console.log("booking: ", booking[0]);
      return (
        <div className="grid grid-cols-12 gap-3 ">
          {Object.entries(booking[0]).map(([key, value], index) => {
            console.log("key: ", key, value);
            if (key !== "hang") {
              return value.map((item) => {
                console.log("item.soghe: ", item);
                return <span className="rowNumber">{item.soGhe}</span>;
              });
            }
          })}
        </div>
      );
    } else return "";
  };
  const handleCellClick = (rowIndex, colIndex) => {
    // Create a copy of the current grid
    console.log("rơ and col: ", rowIndex, colIndex);
    const newGrid = chosenPos.map((row, rIdx) =>
      row.map((cell, cIdx) =>
        rIdx === rowIndex && cIdx === colIndex ? !cell : cell
      )
    );
    // Update the state with the new grid
    setChosenPos(newGrid);
  };
  const renderRowsChair = () => {
    return booking.map((element, index) => {
      if (index != 0) {
        return (
          <div className="text-right flex justify-center items-center mt-3 rowContainer w-full">
            {Object.entries(element).map(([key, value], indexRow) => {
              if (key === "hang")
                return (
                  <span key={indexRow} className="firstChar text-2xl">
                    {value}
                  </span>
                );
              else {
                return (
                  <div className="grid grid-cols-12 gap-8 rowDetail">
                    {value.map((item, index_) => {
                      return (
                        <button
                          className={`ghe ${
                            item.daDat
                              ? "gheDuocChon"
                              : `${
                                  chosenPos[index - 1][index_]
                                    ? "bg-green-500 text-white"
                                    : "text-black bg-gray-300"
                                }`
                          } text-center pt-1 hover:bg-gray-100`}
                          onClick={() => handleCellClick(index - 1, index_)}
                        >
                          {item.soGhe}
                        </button>
                      );
                    })}
                  </div>
                );
              }
            })}
          </div>
        );
      }
    });
  };

  const handleDeletePickedPos = (pos) => {
    const number = pos.match(/\d+/)[0] * 1;
    const Parsedletter = pos.match(/[A-Za-z]+/)[0].charCodeAt(0);
    console.log("number - letter: ", number, Parsedletter);
    let ClonedBooking = booking.map((row) => ({
      ...row,
      danhSachGhe: row.danhSachGhe.map((seat) => ({ ...seat })),
    }));
    const originalParsedLetter = "A".charCodeAt(0);
    console.log("originalParsedLetter: ", originalParsedLetter);
    ClonedBooking.forEach((item, indexRow) => {
      if (indexRow !== 0) {
        item.danhSachGhe.forEach((cell, indexCell) => {
          if (
            Parsedletter - originalParsedLetter === indexRow - 1 &&
            number - 1 === indexCell
          )
            ClonedBooking[indexRow].danhSachGhe[indexCell].daDat = false;
        });
      }
    });
    dispatch(updateBooking(ClonedBooking));
  };

  const renderPickedSheet = () => {
    booking.forEach((item) => {
      item.danhSachGhe.forEach((item_) => {
        if (item_.daDat) {
          console.log("item: ", item_);
          pickedArr.push(item_);
        }
      });
    });

    console.log(pickedArr);
    return pickedArr.map((item) => {
      return (
        <tr>
          <td className={thStyle}>{item.soGhe}</td>
          <td className={thStyle}>{item.gia}</td>
          <td
            className={`text-red-700 ${thStyle} cursor-pointer`}
            onClick={() => handleDeletePickedPos(item.soGhe)}
          >
            X
          </td>
        </tr>
      );
    });
  };

  const renderTotalPrice = () => {
    let res = 0;
    pickedArr.forEach((item) => {
      res += item.gia;
    });
    return res.toLocaleString("vi-VN");
  };

  const handleBookTicket = () => {
    let newBookedTickets = booking.map((row) => ({
      ...row,
      danhSachGhe: row.danhSachGhe.map((seat) => ({ ...seat })),
    }));
    console.log("new: ", newBookedTickets);
    chosenPos.forEach((item, indexRow) => {
      if (indexRow !== 0) {
        item.forEach((item_, indexCell) => {
          if (chosenPos[indexRow - 1][indexCell]) {
            console.log(
              "daDat: ",
              newBookedTickets[indexRow].danhSachGhe[indexCell].daDat
            );
            newBookedTickets[indexRow].danhSachGhe[indexCell].daDat = true;
          }
        });
      }
    });
    console.log("newBookedTickets: ", newBookedTickets);
    dispatch(updateBooking(newBookedTickets));
  };
  return (
    <div className="bookingMovie flex">
      <div className="left flex flex-col justify-center w-2/3 items-center">
        <h1 className="text-orange-500 text-2xl">
          ĐẶT VÉ XEM PHIM CYBERLEARN.VN
        </h1>
        <p className="text-white">Màn hình</p>

        <div className="screen"></div>
        <div>{renderRowNumber()}</div>
        <div className="w-3/5">{renderRowsChair()}</div>

        <div className="mt-5">
          <button
            className="px-4 py-3 bg-orange-500 text-white rounded-sm"
            onClick={handleBookTicket}
          >
            Confirm Your Selection
          </button>
        </div>
      </div>
      <div className="right z-10 w-2/5 flex flex-col justify-center pe-2">
        <div className="text-center text-white text-2xl">
          <h2>Danh sách ghế bạn chọn</h2>
        </div>
        <div>
          <div>
            <span className="me-2 w-5 h-5 bg-green-500 inline-block p-3 border-2 border-green-500 rounded-sm"></span>
            <span className="pb-2 inline-block">Ghế đang chọn</span>
          </div>
          <div>
            <span className="me-2 w-5 h-5 bg-orange-500 inline-block p-3 border-2 border-orange-500 rounded-sm"></span>
            <span className="pb-2 inline-block">Ghế đã chọn</span>
          </div>
          <div>
            <span className="me-2 w-3 h-3 ghe bg-gray-300 inline-block p-3"></span>
            <span className="pb-2 inline-block">Ghế còn trống</span>
          </div>
        </div>

        <table className="table w-full text-center text-yellow-500">
          <thead>
            <tr>
              <th className="text-white px-4 py-3">Số Ghế</th>
              <th className="text-white px-4 py-3">Giá</th>
              <th className="text-white px-4 py-3">Hủy</th>
            </tr>
          </thead>
          <tbody>{renderPickedSheet()}</tbody>
          <tfoot>
            <tr>
              <td className="text-white px-4 py-3">Tổng tiền</td>
              <td className="text-yellow-500">{renderTotalPrice()}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default BookingMovie;
