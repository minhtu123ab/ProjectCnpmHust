import React, { useState, useEffect } from "react";
import { Button, Input, Modal, message } from "antd"; // Make sure Modal is imported
import { FaPlusCircle } from "react-icons/fa";
import { TiArrowUnsorted } from "react-icons/ti";
import axios from "axios";
import AddFeeForm from "./AddFeeForm/AddFeeForm";
import FeeDetailsModal from "./FeeDetailsModal/FeeDetailsModal";

const Fee = () => {
  const [dataDepartment, setDataDepartment] = useState([]);
  const [valuesearchData, setValuesearchData] = useState("");
  const [selectedOption, setSelectedOption] = useState("Lựa chọn tìm kiếm");
  const [isOpen, setIsOpen] = useState(false);
  const [openPlus, setOpenPlus] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const formatDate = (dateString) => {
    // Kiểm tra nếu chuỗi rỗng hoặc không hợp lệ
    if (!dateString) return "";

    // Cắt bỏ phần giờ từ chuỗi thời gian
    const formattedDate = dateString.slice(0, 10); // Lấy 10 ký tự đầu tiên (YYYY-MM-DD)

    return formattedDate;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get("http://localhost:8080/fee");
        setDataDepartment(data.data);
        console.log(data.data);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
    fetchData();
  }, []);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelect = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  const filterData = (value) => {
    if (!value) return dataDepartment;
    switch (selectedOption) {
      case "Tên phí":
        return dataDepartment.filter((item) =>
          item.nameFee.toLowerCase().includes(value.toLowerCase())
        );
      case "Giá phí":
        return dataDepartment.filter((item) => item.price == value);
      case "Loại phí":
        return dataDepartment.filter((item) =>
          item.typeFee.toLowerCase().includes(value.toLowerCase())
        );
      case "Ngày bắt đầu":
        return dataDepartment.filter((item) =>
          item.startDate.toLowerCase().includes(value.toLowerCase())
        );
      case "Ngày kết thúc":
        return dataDepartment.filter((item) =>
          item.endDate.toLowerCase().includes(value.toLowerCase())
        );
      default:
        return dataDepartment;
    }
  };

  const onChange = (e) => {
    setValuesearchData(e.target.value);
  };

  const searchData = filterData(valuesearchData);

  const showDeleteConfirm = (item) => {
    Modal.confirm({
      title: "Bạn có chắc chắn muốn xóa khoản phí này?",
      content: `Tên phí: ${item.nameFee}`,
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy bỏ",
      async onOk() {
        try {
          // Gọi API để xóa phòng, thay 'http://localhost:3000/Departments' bằng URL của bạn
          const response = await axios.delete(
            `http://localhost:8080/fee/${item._id}`
          );
          if (response.status === 200) {
            // Xóa thành công, cập nhật lại danh sách phòng
            setDataDepartment((prevData) =>
              prevData.filter((x) => x._id !== item._id)
            );
            message.success("Xóa thành công!");
          } else {
            throw new Error("Failed to delete");
          }
        } catch (error) {
          console.error("Error deleting the item:", error);
          message.error("Xóa thất bại!");
        }
      },
      onCancel() {
        // Người dùng hủy bỏ, chỉ cần đóng modal
        console.log("Cancel delete");
      },
    });
  };
  const updateFees = (newFee) => {
    setDataDepartment([...dataDepartment, newFee]);
  };
  const [selectedFee, setSelectedFee] = useState(null);

  const showFeeDetails = (fee) => {
    setSelectedFee(fee);
    setOpenEdit(true);
  };

  const updateFeeDetails = (updatedFee) => {
    setDataDepartment((prevData) =>
      prevData.map((item) => (item._id === updatedFee._id ? updatedFee : item))
    );
    setOpenEdit(false);
  };

  return (
    <div className="department-all">
      {openPlus && (
        <AddFeeForm
          visible={openPlus}
          onClose={() => setOpenPlus(false)}
          updateFees={updateFees}
        />
      )}
      {openEdit && (
        <FeeDetailsModal
          visible={openEdit}
          onClose={() => setOpenEdit(false)}
          fee={selectedFee}
          updateFee={updateFeeDetails}
        />
      )}
      <div className="department">
        <h2>Danh sách phí</h2>
        <Button
          className="btn-plus-department"
          type="primary"
          onClick={() => setOpenPlus(true)}
        >
          <FaPlusCircle className="icon-btn-plus-department" size={20} />
          Thêm phí mới
        </Button>
        <div className="search-department">
          <Input
            className="input-search-department"
            placeholder="Tìm kiếm"
            value={valuesearchData}
            onChange={onChange}
            disabled={selectedOption === "Lựa chọn tìm kiếm"}
          />
          <div className="dropdown-container">
            <button className="dropdown-button" onClick={toggleDropdown}>
              {selectedOption}
              <TiArrowUnsorted className="icon-search-department" />
            </button>
            {isOpen && (
              <ul className="dropdown-content">
                {[
                  "Lựa chọn tìm kiếm",
                  "Tên phí",
                  "Loại phí",
                  "Giá phí",
                  "Ngày bắt đầu",
                  "Ngày kết thúc",
                ].map((option) => (
                  <li key={option} onClick={() => handleSelect(option)}>
                    {option}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <table className="table-container">
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên phí</th>
              <th>Loại phí</th>
              <th>Giá phí</th>
              <th>Ngày bắt đầu</th>
              <th>Ngày kết thúc</th>
              <th>Tùy chọn</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(searchData) && searchData.length > 0 ? (
              searchData.map((item, index) => (
                <tr key={item._id}>
                  <td>{index + 1}</td>
                  <td>{item.nameFee}</td>
                  <td>{item.typeFee}</td>
                  <td>
                    {item.price ? item.price.toLocaleString("vi-VN") + "đ" : ""}
                  </td>
                  <td>{formatDate(item.startDate)}</td>
                  <td>{formatDate(item.endDate)}</td>
                  <td className="btn-table-department">
                    <Button type="primary" onClick={() => showFeeDetails(item)}>
                      Chi tiết
                    </Button>
                    <Button
                      type="primary"
                      style={{ backgroundColor: "red" }}
                      onClick={() => showDeleteConfirm(item)}
                    >
                      Xóa
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">Không tìm thấy dữ liệu phù hợp</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Fee;
