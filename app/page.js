"use client";
import React, { useEffect, useState } from "react";
import Head from "next/head";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { IoAdd } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { PiExportBold } from "react-icons/pi";
import { motion, AnimatePresence } from "framer-motion";
import { FaTrash } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import { a, form } from "framer-motion/client";
import { HiPencil } from "react-icons/hi2";

export default function Home() {
  const [nav, setNav] = useState(0);
  const [isOpened, setIsOpened] = useState(false);
  const [isEditing, setIsEditing] = useState(false)
  const [room, setRoom] = useState([]);
  const [boys, setBoys] = useState([]);
  const [girls, setGirls] = useState([]);
  const [forms, setForms] = useState([]);
const [currentFormEditingIndex, setCurrentFormEditingIndex] = useState(0)
  // input
  const [roomNumber, setRoomNumber] = useState(0);
  const [roomCapacity, setRoomCapacity] = useState(0);
  const [formName, setFormName] = useState("");
  const [formClass, setFormClass] = useState(0);
  const [roll, setRoll] = useState(0);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await fetch("/api/fetchroom");
        const data = await res.json();
        // console.log(res);

        if (data.status === "200" || data.status === 200) {
          setRoom(data.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    const fetchForm = async () => {
      try {
        const res = await fetch("/api/fetchform");
        const data = await res.json();

        if (data.status === "200" || data.status === 200) {
          await setForms(data.data);
          await console.log(forms);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchForm();
    fetchRoom();
  }, []);

  // Room Handlers
  const handleAddRoom = async () => {
    if (!roomNumber || !roomCapacity) {
      toast.error("Please enter room number and capacity");
      return;
    }

    const roomAlreadyExist = room.some((item) => item.number === roomNumber);
    if (roomAlreadyExist) {
      toast.error("Room number already exists");
      return;
    }

    const addRoomPromise = fetch("/api/addroom", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ number: roomNumber, capacity: roomCapacity }),
    }).then(async (res) => {
      const data = await res.json();
      if (!res.ok || data.status !== 200) {
        throw new Error(data.message || "Failed to add room");
      }

      // Update state only when successful
      setRoom((prev) => [
        ...prev,
        { number: roomNumber, capacity: roomCapacity },
      ]);
      setRoomNumber(0);
      setRoomCapacity(0);

      return "Room added successfully"; // success message for toast
    });

    toast.promise(addRoomPromise, {
      loading: "Adding room...",
      success: (msg) => msg,
      error: (err) => err.message || "Server error",
    });
  };

  const handleRoomDelete = (index) => {
    const roomId = room[index]._id;
    console.log(roomId);

    const deletePromise = fetch("/api/deleteroom", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ number: roomId }),
    }).then(async (res) => {
      const data = await res.json();
      if (!res.ok || data.status !== 200) {
        throw new Error(data.message || "Failed to delete room");
      }

      // Update state after success
      setRoom((prev) => prev.filter((_, i) => i !== index));

      return "Room deleted successfully"; // success message
    });

    toast.promise(deletePromise, {
      loading: "Deleting room...",
      success: (msg) => msg,
      error: (err) => err.message || "Server error",
    });
  };

  const handleChangeRoomNumber = (e) => {
    setRoomNumber(e.target.value);
  };

  const handleChangeRoomCapacity = (e) => {
    setRoomCapacity(e.target.value);
    console.log(e.target.value);
  };

  // Form Handlers

  const handleChangeFormName = (e) => {
    let formName = e.target.value;
    let lowerCaseFormName = formName.toLowerCase();
    let trimmedFormName = lowerCaseFormName.trim();
    setFormName(trimmedFormName);
  };

  const handleChangeFormClass = (e) => {
    setFormClass(Number(e.target.value));
    console.log(e.target.value);
  };

  const handleChangeRoll = (e) => {
    setRoll(Number(e.target.value));
  };

  const handleOpenRollAddingBox = () => {
    if (!Array.isArray(forms)) {
      toast.error("Forms data not loaded yet");
      return;
    }
    if (formName === "" || formClass === 0) {
      toast.error("Please enter form name and class");
      return;
    }
    console.log(forms);

    let isFormExist = forms.some((item) => {
      if (item.name === formName && item.class === formClass) {
        let isExist = true;
        toast.error("Form already exist");
        return true;
      }
    });

    if (isFormExist) {
      return;
    }

    setIsOpened(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (
        roll === 0 ||
        roll === null ||
        roll === undefined ||
        roll === NaN ||
        roll === ""
      ) {
        toast.error("Please enter roll number");
        return;
      }
      let isExist = false;
      for (let i = 0; i < boys.length; i++) {
        if (boys[i] === roll) {
          isExist = true;
          break;
        }
      }

      for (let i = 0; i < girls.length; i++) {
        if (girls[i] === roll) {
          isExist = true;
          break;
        }
      }

      const existsInForms = forms.some((item) => item.boys.includes(roll));
      if (existsInForms) {
        toast.error("Roll already exists in this class");
        return;
      }

      if (isExist) {
        toast.error("Roll already exist in this form");
        return;
      }
      setBoys([...boys, roll]);
      setRoll(0);
      console.log(boys);
    } else if (e.key === " ") {
      if (roll.length > 3) {
        toast.error("Roll number should be 3 digits");
        return;
      } else if (
        roll === 0 ||
        roll === null ||
        roll === undefined ||
        roll === NaN ||
        roll === ""
      ) {
        toast.error("Please enter roll number");
        return;
      }
      let isExist = false;
      for (let i = 0; i < girls.length; i++) {
        if (girls[i] === roll) {
          isExist = true;
          break;
        }
      }
      for (let i = 0; i < boys.length; i++) {
        if (boys[i] === roll) {
          isExist = true;
          break;
        }
      }


      const existsInForms = forms.some((item) => item.girls.includes(roll));
      if (existsInForms) {
        toast.error("Roll already exists in this class");
        return;
      }

      if (isExist) {
        toast.error("Roll already exist in this form");
        return;
      }

      setGirls([...girls, roll]);
      setRoll(0);
    } else {
      return;
    }
  };

  const handleDeleteBoys = (e) => {
    setBoys((prev) => boys.filter((_, i) => i !== e));
  };
  const handleDeleteGirls = (e) => {
    setGirls((prev) => girls.filter((_, i) => i !== e));
  };

  const handleCloseFormDiv = async () => {
    if (boys.length < 5) {
      toast.error("You have to add at least 5 boys");
      return;
    } else if (girls.length < 5) {
      toast.error("You have to add at least 5 girls");
      return;
    }

    setIsOpened(false);

    const totalBoys = boys.length;
    const totalGirls = girls.length;

    const addFormPromise = fetch("/api/addform", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: formName,
        class: formClass,
        boys: boys,
        girls: girls,
        totalBoys: totalBoys,
        totalGirls: totalGirls,
      }),
    }).then(async (res) => {
      const data = await res.json();
      if (!res.ok || data.status !== 200) {
        throw new Error(data.message || "Failed to add form");
      }

      // reset after success
      setForms((prev) => [...prev,{
        name: formName,
        class: formClass,
        boys: boys,
        girls: girls,
        totalBoys: totalBoys,
        totalGirls: totalGirls,
      }]);
      setFormName("");
      setFormClass(0);
      setBoys([]);
      setGirls([]);

      return "Form added successfully"; // ✅ success message
    });

    toast.promise(addFormPromise, {
      loading: "Adding form...",
      success: (msg) => msg,
      error: (err) => err.message || "Server error",
    });
  };

  const handleFormDelete = (e) => {
    let formId = forms[e]._id;
    console.log(formId);

    const deleteFormPromise = fetch("/api/deleteform", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        number: formId,
      }),
    }).then(async (res) => {
      const data = await res.json();
      if (!res.ok || data.status !== 200) {
        throw new Error(data.message || "Failed to delete form");
      }

      // Update state after success
      setForms((prev) => prev.filter((_, i) => i !== e));

      // reset after success
      return "Form deleted successfully"; // ✅ success message
    });

    toast.promise(deleteFormPromise, {
      loading: "Deleting form...",
      success: (msg) => msg,
      error: (err) => err.message || "Server error",
    });
  };

  const handleRollEditBox = (e) => {
    setIsEditing(true);
    setCurrentFormEditingIndex(e);
    setBoys(forms[e].boys);
    setGirls(forms[e].girls);
  };

  const handleCloseEditingDiv = async () => {
  if (boys.length < 5) {
    toast.error("You have to add at least 5 boys");
    return;
  }
  if (girls.length < 5) {
    toast.error("You have to add at least 5 girls");
    return;
  }

  const editIndex = currentFormEditingIndex;
  const id = forms[editIndex]._id;
  const name = forms[editIndex].name;
  const class0 = forms[editIndex].class;

  const editPromise = fetch("/api/updateform", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      _id: id,
      name:name,
      class: class0,
      boys:boys,
      girls:girls,
      totalBoys: boys.length,
      totalGirls: girls.length,
    }),
  }).then(async (res) => {
    const data = await res.json();
    if (!res.ok || data.status !== 200) {
      throw new Error(data.message || "Failed to edit form");
    }

    // Update state after success
    setForms((prev) =>
      prev.map((form, i) =>
        i === editIndex
          ? {
              ...form,
              name,
              class: class0,
              boys,
              girls,
              totalBoys: boys.length,
              totalGirls: girls.length,
            }
          : form
      )
    );

    setFormName("");
    setFormClass(0);
    setBoys([]);
    setGirls([]);
    setIsEditing(false);

    return "Form edited successfully";
  });

  toast.promise(editPromise, {
    loading: "Editing form...",
    success: (msg) => msg,
    error: (err) => err.message || "Server error",
  });

  await editPromise; // optional if you want to wait for completion
};



  return (
    <>
      <div className="py-4 px-4 h-screen flex text-white relative">
        {/* Sidebar */}
        <div className="bg-[#242020] h-full rounded-[15px] w-1/5 py-10 relative">
          <h1 className="px-16 font-[GEB] text-4xl">Seat Plan</h1>
          <div className="py-20 px-14 flex flex-col justify-between h-full relative">
            <div className="relative flex flex-col space-y-5">
              {/* Dashboard */}
              <div
                className="relative cursor-pointer rounded-[10px] z-0"
                onClick={() => setNav(0)}
              >
                {nav === 0 && (
                  <motion.div
                    layoutId="highlight"
                    className="absolute inset-0 bg-[#C8FF00]  z-[-1] rounded-[10px]"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                <div
                  className={`flex items-center gap-2 p-3 ${
                    nav === 0
                      ? "text-gray-950 font-[GB] text-xl z-9"
                      : "font-[GB] text-xl text-white"
                  }`}
                >
                  <MdOutlineSpaceDashboard size={25} /> Dashboard
                </div>
              </div>

              {/* Add Form */}
              <div
                className="relative cursor-pointer rounded-[10px] z-0"
                onClick={() => setNav(1)}
              >
                {nav === 1 && (
                  <motion.div
                    layoutId="highlight"
                    className="absolute inset-0 bg-[#C8FF00] z-[-1] rounded-[10px]"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                <div
                  className={`flex items-center gap-2 p-3 ${
                    nav === 1
                      ? "text-gray-950 font-[GB] text-xl z-9"
                      : "font-[GB] text-xl text-white"
                  }`}
                >
                  <IoAdd size={25} /> Add Form
                </div>
              </div>

              {/* Add Room */}
              <div
                className="relative cursor-pointer rounded-[10px] z-0"
                onClick={() => setNav(2)}
              >
                {nav === 2 && (
                  <motion.div
                    layoutId="highlight"
                    className="absolute inset-0 bg-[#C8FF00] z-[-1] rounded-[10px]"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                <div
                  className={`flex items-center gap-2 p-3 ${
                    nav === 2
                      ? "text-gray-950 font-[GB] text-xl z-1"
                      : "font-[GB] text-xl text-white"
                  }`}
                >
                  <IoAdd size={25} /> Add Room
                </div>
              </div>
            </div>

            {/* Export button */}
            <h1 className="font-[GB] text-xl  flex items-center ml-4 gap-2">
              <span className="cursor-pointer flex gap-2">
                <PiExportBold size={25} /> Export{" "}
              </span>
            </h1>
          </div>
        </div>

        {/* Dahshboard */}
        {nav === 0 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: -0 }}
            className="w-4/5 pr-4 gap-5 flex flex-col"
          >
            <div className="w-full h-[60vh] ml-5 bg-[#242020] p-10  rounded-[15px] ">
              <h1 className="font-[GB] text-3xl">Dashboard</h1>
            </div>
            <div className="flex w-full h-full ml-5 gap-5">
              <div className="w-1/2 h-full  bg-[#242020] p-10  rounded-[15px] "></div>

              <div className="w-1/2 h-full ml- bg-[#242020] p-10  rounded-[15px] "></div>
            </div>
          </motion.div>
        )}

        {nav === 1 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: -0 }}
            className="w-4/5 pr-4 gap-5 flex flex-col"
          >
            <div className="w-full h-[60vh] ml-5 bg-[#242020] p-10  rounded-[15px] ">
              {/* upperdiv  */}
              <div className=" w-full h-full flex flex-col">
                <h1 className="font-[GB] text-3xl">Add Form</h1>
                <div className="bg w-full h-full flex items-center gap-5">
                  <input
                    name="Room Number"
                    className="w-1/2 h-14 rounded-lg focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] transition-[color,box-shadow] outline-none bg-[#282828] ring-[#636363] px-5"
                    placeholder="Enter Form Name"
                    value={formName || ""}
                    onChange={handleChangeFormName}
                    type="text"
                  />
                  <input
                    name="Room Capacity"
                    className="w-1/2 h-14 rounded-lg focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] transition-[color,box-shadow] outline-none bg-[#282828] ring-[#636363] px-5"
                    placeholder="Enter Class"
                    value={formClass || ""}
                    onChange={handleChangeFormClass}
                    type="number"
                  />
                  <button
                    className="bg-[#C8FF00] hover:bg-[#C8FF00]/80 transition-all duration-300 font-bold w-16 flex justify-center items-center rounded-lg h-14"
                    onClick={handleOpenRollAddingBox}
                  >
                    <IoAdd
                      color="#000"
                      className="hover:h-9 h-7 transition-all duration-300 hover:w-9 w-7"
                    />
                  </button>
                </div>
              </div>
            </div>
            <div className="w-full ml-5 h-full  bg-[#242020] p-10  rounded-[15px] ">
              <h1 className="font-[GB] text-3xl">Add Forms</h1>
              {/* lower div  */}

              <div className="w-full py-3 transition-all duration-500  gap-2 flex">
                <AnimatePresence>
                  {forms.map((form, index) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8, y: -20 }}
                      transition={{
                        duration: 0.3,
                        ease: "easeInOut",
                        delay: index * 0.05,
                      }}
                      key={index}
                      className="group overflow-hidden flex px-5 cursor-pointer flex-col hover:delay-300 items-start hover:shadow-2xl bg-[#C8FF00] hover:h-44 transition-all duration-300 h-12 text-gray-950   py-2 rounded-md w-48 justify-between gap-5"
                    >
                      <div className="flex w-full items-center justify-between">
                        <h1 className="font-[GB] text-2xl capitalize">{form.name} </h1>
                        <FaTrash
                          onClick={() => handleFormDelete(index)}
                          className="hover:cursor-pointer scale-125 h-3  w-3 "
                        />
                      </div>
                      <div className="">
                        <h2 className="font-[GB] group-hover:opacity-100 delay-300 group-hover:delay-0 opacity-0 text-xl">
                          Boys - {form.boys.length}
                        </h2>

                        <h2 className="font-[GB] group-hover:opacity-100 delay-300 group-hover:delay-0 opacity-0 text-xl">
                          Girls - {form.girls.length}
                        </h2>
                      </div>

                      <div className=" flex items-center w-full justify-between">
                        <h2 className="font-[GB] group-hover:opacity-100 delay-300 group-hover:delay-0 opacity-0 text-xl">
                          Class - {form.class}
                        </h2>
                        <HiPencil onClick={() =>handleRollEditBox(index)} size={18} className="group-hover:opacity-100 delay-300 transition-all duration-1000 ease-in-out hover:rotate-360 cursor-pointer group-hover:delay-0 opacity-0 ml-4" />
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}

        {nav === 2 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: -0 }}
            className="w-4/5 pr-4 gap-5 flex flex-col"
          >
            <div className="w-full h-[60vh] ml-5 bg-[#242020] p-10  rounded-[15px] ">
              {/* upperdiv */}
              <div className=" w-full h-full flex flex-col">
                <h1 className="font-[GB] text-3xl">Add Room</h1>
                <div className="bg w-full h-full flex items-center gap-5">
                  <input
                    name="Room Number"
                    className="w-1/2 h-14 rounded-lg focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] transition-[color,box-shadow] outline-none bg-[#282828] ring-[#636363] px-5"
                    placeholder="Enter Room Number"
                    value={roomNumber || ""}
                    onChange={handleChangeRoomNumber}
                    type="number"
                  />
                  <input
                    name="Room Capacity"
                    className="w-1/2 h-14 rounded-lg focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] transition-[color,box-shadow] outline-none bg-[#282828] ring-[#636363] px-5"
                    placeholder="Enter Room Capacity"
                    value={roomCapacity || ""}
                    onChange={handleChangeRoomCapacity}
                    type="number"
                  />
                  <button
                    className="bg-[#C8FF00] hover:bg-[#C8FF00]/80 transition-all duration-300 font-bold w-16 flex justify-center items-center rounded-lg h-14"
                    onClick={handleAddRoom}
                  >
                    <IoAdd
                      color="#000"
                      className="hover:h-9 h-7 transition-all duration-300 hover:w-9 w-7"
                    />
                  </button>
                </div>
              </div>
            </div>
            <div className="w-full ml-5 h-full  bg-[#242020] p-10 flex flex-col  rounded-[15px] ">
              <h1 className="font-[GB] text-3xl">Add Rooms</h1>
              {/* lower div  */}
              <div className="w-full py-3 transition-all duration-500  gap-5 flex">
                <AnimatePresence>
                  {room.map((room, index) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8, y: -20 }}
                      transition={{
                        duration: 0.3,
                        ease: "easeInOut",
                        delay: index * 0.05,
                      }}
                      key={index}
                      className="group overflow-hidden flex cursor-pointer flex-col hover:delay-300 items-start bg-[#C8FF00] hover:h-24 transition-all duration-300 h-12 text-gray-950  px-3 py-2 rounded-md w-24 justify-between gap-5"
                    >
                      <div className="flex w-full items-center justify-between">
                        <h1 className="font-[GB] text-2xl">{room.number} </h1>
                        <FaTrash
                          onClick={() => handleRoomDelete(index)}
                          className="hover:cursor-pointer scale-125 h-3  w-3 "
                        />
                      </div>
                      <h2 className="font-[GB] group-hover:opacity-100 delay-300 group-hover:delay-0 opacity-0 text-2xl">
                        {room.capacity}
                      </h2>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {isOpened && (
        <div className="w-full h-full fixed flex top-0 justify-between left-0 backdrop-blur-sm bg-black/50 ">
          <div className="w-1/3 b-amber-100  h-full flex flex-col gap-3 px-3 py-2 ">
            <h1 className="font-[GB] text-3xl text-[#FFFFFF]">Boys</h1>
            <div className="w-full h-[90vh] grid-flow-col grid grid-cols-4 grid-col grid-rows-12  gap-4  ">
              {boys.map((roll, index) => (
                <div
                  key={index}
                  className="w-28 h-14 flex items-center rounded-lg justify-between px-3 bg-[#C8FF00] "
                >
                  <h1 className="font-[GEB] text-2xl text-[#000]">{roll}</h1>
                  <FaTrash
                    onClick={() => handleDeleteBoys(index)}
                    className="hover:cursor-pointer scale-125 h-3  w-3 "
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="w-1/3  h-full px-3 flex flex-col gap-3 py-2">
            <h1 className="font-[GB] text-end text-3xl text-[#FFFFFF]">
              Girls
            </h1>
            <div className="w-full h-[95vh]  py-3 grid grid-cols-4 grid-flow-col justify-end grid-rows-12 gap-3  ">
              {girls.map((roll, index) => (
                <div
                  key={index}
                  className="w-28 h-14 flex items-center rounded-lg justify-between px-3 bg-[#C8FF00] "
                >
                  <h1 className="font-[GEB] text-2xl text-[#000]">{roll}</h1>
                  <FaTrash
                    onClick={() => handleDeleteGirls(index)}
                    className="hover:cursor-pointer scale-125 h-3  w-3 "
                  />
                </div>
              ))}
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="h-64 w-1/3 flex flex-col gap-2 items-center justify-center rounded-2xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#C8FF00]"
          >
            <RxCross2
              onClick={handleCloseFormDiv}
              className="h-7 w-7 hover:rotate-90 transition-all duration-300 z-10 cursor-pointer absolute top-3 right-3"
            />
            <div className="flex flex-col items-start justify-center w-2/3">
              <h4 className="font-[GM] text-md">
                Press <span className="font-[GEB]">Enter</span> for Boy and{" "}
                <span className="font-[GEB]">Space</span> for Girls
              </h4>
              <input
                name="Room Number"
                className="w-full h-14 rounded-lg focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] transition-[color,box-shadow] outline-none bg-[#282828] text-white ring-[#7d7d7d] px-5"
                placeholder="Enter Form Name"
                maxLength={3}
                value={roll || ""}
                onKeyDown={(e) => {
                  handleKeyDown(e);
                }}
                onChange={handleChangeRoll}
                type="text"
              />
            </div>
          </motion.div>
        </div>
      )}

      {isEditing && (
        <div className="w-full h-full fixed flex top-0 justify-between left-0 backdrop-blur-sm bg-black/50 ">
          <div className="w-1/3 b-amber-100  h-full flex flex-col gap-3 px-3 py-2 ">
            <h1 className="font-[GB] text-3xl text-[#FFFFFF]">Boys</h1>
            <div className="w-full h-[90vh] grid-flow-col grid grid-cols-4 grid-col grid-rows-12  gap-4  ">
              {boys.map((roll, index) => (
                <div
                  key={index}
                  className="w-28 h-14 flex items-center rounded-lg justify-between px-3 bg-[#C8FF00] "
                >
                  <h1 className="font-[GEB] text-2xl text-[#000]">{roll}</h1>
                  <FaTrash
                    onClick={() => handleDeleteBoys(index)}
                    className="hover:cursor-pointer scale-125 h-3  w-3 "
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="w-1/3  h-full px-3 flex flex-col gap-3 py-2">
            <h1 className="font-[GB] text-end text-3xl text-[#FFFFFF]">
              Girls
            </h1>
            <div className="w-full h-[95vh]  py-3 grid grid-cols-4 grid-flow-col justify-end grid-rows-12 gap-3  ">
              {girls.map((roll, index) => (
                <div
                  key={index}
                  className="w-28 h-14 flex items-center rounded-lg justify-between px-3 bg-[#C8FF00] "
                >
                  <h1 className="font-[GEB] text-2xl text-[#000]">{roll}</h1>
                  <FaTrash
                    onClick={() => handleDeleteGirls(index)}
                    className="hover:cursor-pointer scale-125 h-3  w-3 "
                  />
                </div>
              ))}
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="h-64 w-1/3 flex flex-col gap-2 items-center justify-center rounded-2xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#C8FF00]"
          >
            <RxCross2
              onClick={handleCloseEditingDiv}
              className="h-7 w-7 hover:rotate-90 transition-all duration-300 z-10 cursor-pointer absolute top-3 right-3"
            />
            <div className="flex flex-col items-start justify-center w-2/3">
              <h4 className="font-[GM] text-md">
                Press <span className="font-[GEB]">Enter</span> for Boy and{" "}
                <span className="font-[GEB]">Space</span> for Girls
              </h4>
              <input
                name="Room Number"
                className="w-full h-14 rounded-lg focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] transition-[color,box-shadow] outline-none bg-[#282828] text-white ring-[#7d7d7d] px-5"
                placeholder="Enter Form Name"
                maxLength={3}
                value={roll || ""}
                onKeyDown={(e) => {
                  handleKeyDown(e);
                }}
                onChange={handleChangeRoll}
                type="text"
              />
            </div>
          </motion.div>
        </div>
      )}
      <Toaster position="top-right" />
    </>
  );
}
