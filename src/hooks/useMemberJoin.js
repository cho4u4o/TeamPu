import { axios, requests } from "../apis";
import { useNavigate } from "react-router-dom";
import { useState, useReducer } from "react";
import { useAdminView } from "./useAdminView";
import { getCookie } from "../utils";

export const useMemberJoin = () => {
  const { fetchAdmin } = useAdminView();
  const [editedData, setEditedData] = useState();

  const initialState = {
    loginId: "",
    password: "",
    name: "",
    college: "",
    department: "",
    phoneNumber: "",
    email: "",
  };

  const initialLoginState = {
    loginId: "",
    password: "",
  };

  const initialEditState = {
    name: "",
    phoneNumber: "",
    email: "",
  };

  const placeholders = [
    "ID",
    "비밀번호",
    "이름",
    "소속 단과대",
    "학과 또는 전공",
    "전화번호",
    "이메일",
  ];

  const reducer = (state, action) => {
    return { ...state, [action.name]: action.value };
  };

  const loginReducer = (state, action) => {
    switch (action.type) {
      case "RESET":
        return initialLoginState;
      default:
        return { ...state, [action.name]: action.value };
    }
  };

  const navigate = useNavigate();
  const [formData, dispatch] = useReducer(reducer, initialState);
  const [loginData, loginDispatch] = useReducer(
    loginReducer,
    initialLoginState,
  );
  const [editData, editDispatch] = useReducer(reducer, initialEditState);
  const [loading, setLoading] = useState(false);

  const joinMember = (data) => {
    axios
      .post(requests.postMemberJoin, data)
      .then(() => {
        navigate("/login");
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => setLoading(false));
  };

  const postLogin = (data) => {
    vertifyAdmin(data);
  };

  const postEdit = (data) => {
    editUser(data);
  };

  async function editUser(data) {
    const response = await axios.patch(requests.patchUserInfo, data, {
      headers: { Authorization: getCookie("token") },
    });
    setEditedData(response.data.body);
  }

  async function vertifyAdmin(data) {
    const response = await axios.post(requests.postMemberLogin, data);
    if (response.status === 401) {
      alert("아이디와 비밀번호를 확인해주세요.");
      loginDispatch({ type: "RESET" });
    }
    document.cookie = `token=${response.headers.authorization}; max-age=3600; path=/`;
    const isAdmin = await fetchAdmin();
    if (isAdmin) {
      navigate("/admin");
    } else {
      navigate("/");
    }
  }

  const handleChange = (e) => {
    dispatch({ name: e.target.name, value: e.target.value });
  };

  const handleLoginChange = (e) => {
    loginDispatch({ name: e.target.name, value: e.target.value });
  };

  const handleEditChange = (e) => {
    editDispatch({ name: e.target.name, value: e.target.value });
  };

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.password) {
      alert("모든 정보를 입력해주세요.");
      return false;
    }
    return true;
  };

  const validateLoginForm = () => {
    if (!loginData.loginId || !loginData.password) {
      alert("아이디와 비밀번호를 모두 입력해주세요.");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setLoading(true);
    joinMember({ ...formData, type: "UNDERGRADUATE" });
  };

  const handleLoginSubmit = async () => {
    if (!validateLoginForm()) return;
    postLogin({ ...loginData });
  };

  const handleEditSubmit = async () => {
    postEdit({ ...editData });
  };

  return {
    initialState,
    placeholders,
    formData,
    reducer,
    joinMember,
    handleChange,
    handleSubmit,
    validateForm,
    loading,
    postLogin,
    handleLoginSubmit,
    handleLoginChange,
    loginData,
    handleEditChange,
    handleEditSubmit,
    editData,
    editedData,
  };
};