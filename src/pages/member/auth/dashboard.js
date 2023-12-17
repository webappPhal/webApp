import React from "react";
import { withAuthSync } from "../../../lib/auth";
import { useState, useEffect } from "react";
import styles from "../../../styles/dashboard.module.css";
import { AiOutlineUserAdd } from "react-icons/ai";
import { BsThreeDots } from "react-icons/bs";
import { RiCoupon2Line } from "react-icons/ri";
import AddUserFrom from "../../../components/AddUserForm";
import Form from "../../../components/Form/Form";
const Dashboard = (props) => {
  const [showItem, setShowItem] = useState({
    first: true,
    third: false,
  });
  const [mobile, setMobile] = useState(false);
  const [showMenu, setShowMenu] = useState(true);

  const [sidebarExpand, setSideBarExpand] = useState(false);

  useEffect(() => {
    let width = window.innerWidth;
    if (width < 481) {
      setMobile(true);
    }
    if (width > 481) {
      setMobile(false);
    }
  }, [mobile]);

  // let username = props.token.token.split("@");
  let username = "som";

  return (
    <>
      {showMenu ? (
        <div
          className={sidebarExpand ? styles.menuBarExpand : styles.menuBar}
          onMouseEnter={() => setSideBarExpand(true)}
          onMouseLeave={() => setSideBarExpand(false)}
        >
          <div className={styles.menu}>
            <BsThreeDots className={styles.hamIcon} />
          </div>
          <div className={styles.close}>
            {/* <span>
              <BsThreeDots className={styles.close} />
              CLOSE
            </span> */}
          </div>

          <div className={styles.list}>
            <span
              className={showItem.first ? styles.spanActive : styles.span}
              onClick={() =>
                setShowItem({
                  ...showItem,
                  first: true,
                  third: false,
                })
              }
            >
              <RiCoupon2Line
                className={
                  showItem.first ? styles.barIconActive : styles.barIcon
                }
              />

              <p className={styles.item}>From</p>
            </span>

            {/* {props.token.role === "Admin" ? ( */}
            <div className={styles.list}>
              <div className={styles.head}>
                <p className={styles.head}>User</p>
              </div>
              <span
                className={showItem.third ? styles.spanActive : styles.span}
                onClick={() =>
                  setShowItem({
                    ...showItem,
                    third: true,
                    first: false,
                  })
                }
              >
                <AiOutlineUserAdd
                  className={
                    showItem.third ? styles.barIconActive : styles.barIcon
                  }
                />

                <p className={styles.item}>Add User</p>
              </span>
            </div>
            {/* ) : (
              ""
            )} */}
          </div>
        </div>
      ) : (
        ""
      )}

      <div className={styles.header}>
        <h2 style={{ textAlign: "center" }}>Welcome {username[0]}</h2>
      </div>

      <div className={styles.dashboard}>
        {showItem.third ? (
          <div className={styles.loan}>
            <h2>Register a User</h2>
            <AddUserFrom />
          </div>
        ) : (
          ""
        )}
        {showItem.first ? (
          <div className={styles.couponWrap}>
            <h2 className="text-lg font-medium">Fill The Form</h2>
            <Form />
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default withAuthSync(Dashboard);
// Dashboard.getInitialProps = async (ctx) => {
//   const { token, USER } = nextCookie(ctx);
//   return {
//     initialName: USER,
//     token: token,
//   };
// };
