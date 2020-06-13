import React, {useState} from "react";
import s from "./Users.module.css";

const Pagination = (props) => {
    let pagesCount = Math.ceil(props.totalUsersCount / props.pageSize);
    let pages = [];
    for (let i = 1; i <= pagesCount; i++) {
        pages.push(i);
    }
    let portionSize = 10;

    let portionCount = Math.ceil(pagesCount / portionSize);
    let [portionNumber, setPortionNumber] = useState(1);
    let leftPortionPageNumber = (portionNumber - 1) * portionSize + 1;
    let rightPortionPageNumber = portionNumber * portionSize;

    return (
        <div>
            {portionNumber > 1 &&
            <button onClick={() => {setPortionNumber(portionNumber - 1)}}>Prev</button>
            }
            {
                pages
                    .filter(p => p >= leftPortionPageNumber && p <= rightPortionPageNumber)
                    .map(p => {
                    return <span onClick={(e) => {
                        props.onPageChange(p)
                    }} className={props.currentPage === p && s.selectedPage}>{p}</span>
                })
            }
            {
                portionCount > portionNumber &&
                    <button onClick={() => {setPortionNumber(portionNumber+1)}}>Next</button>
            }
        </div>
    )
};

export default Pagination;