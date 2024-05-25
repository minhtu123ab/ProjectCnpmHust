import React, { useEffect, useState } from "react";
import "./home.css";
import { FcDepartment } from "react-icons/fc";
import { MdOutlineApartment } from "react-icons/md";
import { IoPeople } from "react-icons/io5";
import axios from "axios";

const Home = () => {
  const [dataDepartment, setDataDepartment] = useState([]);
  const [dataDepartmentEmpty, setDataDepartmentEmpty] = useState([]);
  const [dataPeople, setDataPeople] = useState([]);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get("http://localhost:8080/department");
        setDataDepartment(data.data);
        setDataDepartmentEmpty(
          data.data.filter((item) => item.status === "Trống")
        );
        setRetryCount(0); // Reset retry count on successful fetch
      } catch (err) {
        console.log("Lỗi: ", err);
        if (retryCount < 3) {
          // Giới hạn số lần thử lại
          setTimeout(() => {
            setRetryCount(retryCount + 1);
          }, 3000); // Thử lại sau 3 giây
        }
      }

      try {
        const response = await axios.get("http://localhost:8080/people");
        setDataPeople(response.data.data);
        setRetryCount(0); // Reset retry count on successful fetch
      } catch (err) {
        console.log("Lỗi: ", err);
        if (retryCount < 3) {
          // Giới hạn số lần thử lại
          setTimeout(() => {
            setRetryCount(retryCount + 1);
          }, 3000); // Thử lại sau 3 giây
        }
      }
    };

    fetchData();
  }, [retryCount]); // Phụ thuộc vào retryCount để gọi lại khi cần

  return (
    <div className="home-all">
      <div className="home">
        <div className="title-home">
          <h1 className="title-home-child-header">Chung cư Osaka</h1>
          <p className="title-home-child">Chủ sở hữu: Nguyễn Văn A</p>
          <p className="title-home-child">
            Địa chỉ: Số 1 Đại Cồ Việt - Bách Khoa - Hai Bà Trưng - Hà Nội
          </p>
        </div>
        <div className="img-home">
          <img
            src="https://ecobavietnam.com.vn/upload/images/z2098540260366_989bf4e094a7b74248d038a376f04d91.jpg"
            alt="apartment"
          />
          <img
            src="https://vnn-imgs-f.vgcloud.vn/2019/08/23/16/chon-mua-can-ho-can-trong-voi-nhung-toa-nha-hung-sat-nay.jpg"
            alt="apartment"
          />
          <img
            src="https://cdn.thuvienphapluat.vn/uploads/tintuc/2022/02/07/tang-muc-phat-nhieu-vi-pham-trong-su-dung-nha-chung-cu.jpg"
            alt="apartment"
          />
        </div>
      </div>
      <div className="home-2">
        <div className="home-statistical">
          <p>Tổng số căn hộ : {dataDepartment.length}</p>
          <FcDepartment size={150} />
        </div>
        <div className="home-statistical">
          <p>Số căn hộ còn trống : {dataDepartmentEmpty.length}</p>
          <MdOutlineApartment size={150} />
        </div>
        <div className="home-statistical">
          <p>Tổng dân cư sinh sống : {dataPeople.length}</p>
          <IoPeople size={150} />
        </div>
      </div>
    </div>
  );
};

export default Home;
