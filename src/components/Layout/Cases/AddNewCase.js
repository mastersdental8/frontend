import { useEffect, useState } from "react";
import "./AddNewCase.css";
import axios from "axios";
import * as _global from "../../../config/global";
import { showToastMessage } from "../../../helper/toaster";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";

const initialData = {
  caseNumber: "",
  caseType: "Digital",
  name: "",
  dateIn: "",
  dateOut: "",
  dentistObj: {
    id: "",
    name: "",
    phone: "",
  },
  phone: "",
  address: "",
  patientName: "",
  gender: "",
  age: "",
  patientPhone: "",
  shadeCase: {
    shade: "",
    stumpShade: "",
    gingShade: "",
  },
  occlusalStaining: [],
  texture: "",
  jobDescription: "",
  teethNumbers: [],
  translucency: "",
  naturalOfWorks: [],
  isInvoice: false,
  isEmail: false,
  isPhoto: false,
  isHold: false,
  isUrgent: false,
  isStudy: false,
  isStudy: false,
  isRedo: false,
  oldCaseIds: [],
  redoReason:'',
  photos: [],
  deadline: "",
  dateReceived: "",
  dateReceivedInEmail: "",
  notes: [],
  fitting: [
    {
      technicianName: "",
      technicianId: "",
      dateStart: "",
      dateEnd: "",
      notes: "",
      obj: {},
    },
  ],
  cadCam: [
    {
      technicianName: "",
      technicianId: "",
      dateStart: "",
      dateEnd: "",
      notes: "",
      obj: {},
    },
  ],
  ceramic: [
    {
      technicianName: "",
      technicianId: "",
      dateStart: "",
      dateEnd: "",
      notes: "",
      obj: {},
    },
  ],
  logs: [
    {
      id: "",
      name: "",
      date: "",
      msg: "",
    },
  ],
};

const AddNewCase = () => {
  // const naturalOfWorks = _global.naturalOfWorks
  const navigate = useNavigate();
  const numOfTeeth = _global.numOfTeeth;
  const user = JSON.parse(localStorage.getItem("user"));
  const [caseModel, setCaseModel] = useState(initialData);
  const [buffCaseType, setBuffCaseType] = useState("Digital");
  const [teethData, setTeethData] = useState(null);
  const [teethNumbers, setTeethNumbers] = useState([]);
  const [dentistPhone, setDentistPhone] = useState(" ");
  const [occlusalStaining, setOcclusalStaining] = useState("");
  const [texture, setTexture] = useState("");
  const [naturalOfTeeth, setNaturalOfTeeth] = useState("");
  const [isSubmit, setIsSubmit] = useState(false);
  const [naturalOfWorks, setNaturalOfWorks] = useState(_global.naturalOfWorks);
  const [dentistObj, setDentistObj] = useState({
    id: "",
    name: "",
    phone: "1",
  });
  const [patients, setPatients] = useState([]);

  const [doctors, setDoctors] = useState([]);
  const [doctorsOptions, setDoctorsOptions] = useState([]);
  useEffect(() => {
    axios
      .get(`${_global.BASE_URL}doctors`)
      .then((res) => {
        const result = res.data;
        setDoctors(result);
        setDoctorsOptions(
          res.data.map((c) => {
            return {
              label: `${c.firstName} ${c.lastName}(${c.clinicName})`,
              _id: c._id,
            };
          })
        );
      })
      .catch((error) => {
        console.error("Error fetching doctors:", error);
      });
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCaseModel((prevFormData) => ({ ...prevFormData, [name]: value }));
  };
  const handleChangeShade = (event) => {
    const { name, value } = event.target;
    setCaseModel((prevFormData) => ({
      ...prevFormData, // Keep the rest of the form data
      shadeCase: {
        ...prevFormData.shadeCase, // Keep the previous shadeCase properties
        [name]: value, // Update the specific shadeCase property
      },
    }));
  };
  const handleChangeOcclusal = (event) => {
    setOcclusalStaining(event.target.value);
    //  const { value, checked } = event.target;
    //  if (checked) {
    //    setOcclusalStaining((prevValues) => [...prevValues, value]); // Add value to array
    //  } else {
    //    setOcclusalStaining((prevValues) =>
    //      prevValues.filter((item) => item !== value)
    //    ); // Remove value from array
    //  }
  };
  const handleChangeTexture = (event) => {
    setTexture(event.target.value);
    // const { value, checked } = event.target;
    // if (checked) {
    //   setTexture((prevValues) => [...prevValues, value]); // Add value to array
    // } else {
    //   setTexture((prevValues) => prevValues.filter((item) => item !== value)); // Remove value from array
    // }
  };
  const handleChangeDentist = (event) => {
    const { name, value } = event.target;
    setDentistObj((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };
  const handleChangeSelect = (event) => {
    getNamesPatientsOfDoctor(event._id);
    const doctor = doctors.find((d) => d._id === event._id);
    setCaseModel((prevFormData) => ({
      ...prevFormData,
      address: `${doctor.address.country} ${
        doctor.address.city ? ", " + doctor.address.city : ""
      }`,
    }));

    setDentistObj((prevFormData) => ({
      ...prevFormData,
      id: event._id,
    }));
  };
  const handleChangeSelectPatient = (event) => {
    if (event) {
      setCaseModel((prevFormData) => ({
        ...prevFormData,
        patientName: event.value,
      }));
    }
  };
  const getNamesPatientsOfDoctor = (id) => {
    axios
      .get(`${_global.BASE_URL}doctors/patients/${id}`)
      .then((res) => {
        // const result = res.data;
        setPatients(
          res.data.patients.map((c) => {
            return {
              label: `${c.name } (${_global.formatDateToYYYYMMDD(c.dateIn)})`,
              value: c.name ,
            };
          })
        );
      })
      .catch((error) => {
        console.error("Error fetching Patients of doctors:", error);
      });
  };
  const handleSubmit = async () => {
    setIsSubmit(true);
    if (dentistObj.id !== "") {
      const buffDoctor = doctors.find((doctor) => doctor._id === dentistObj.id);
      let model = {
        caseType: buffCaseType,
        dateIn: caseModel.dateIn,
        dateOut: caseModel.dateOut,
        dentistObj: {
          id: dentistObj.id,
          name: `${buffDoctor.firstName}, ${buffDoctor.lastName}, (${buffDoctor.clinicName})`,
          phone: dentistPhone,
        },
        address: caseModel.address,
        patientName: caseModel.patientName,
        age: caseModel.age,
        gender: caseModel.gender,
        patientPhone: caseModel.patientPhone,
        shadeCase: caseModel.shadeCase,
        occlusalStaining: occlusalStaining,
        texture: texture,
        jobDescription: caseModel.jobDescription,
        isInvoice: false,
        isEmail: false,
        isPhoto: false,
        isHold: false,
        isUrgent: false,
        isStudy: caseModel.isStudy,
        isRedo: false,
  oldCaseIds: [],
        redoReason:caseModel.redoReason,
        teethNumbers: teethNumbers,
        naturalOfWorks: [],
        translucency: caseModel.translucency,
        photos: [],
        fitting: {
          namePhase: "Fitting",
          actions: [],
          status: {
            isStart: true,
            isPause: false,
            isEnd: false,
          },
          obj: {},
        },
        plaster: {
          namePhase: "Fitting",
          actions: [],
          status: {
            isStart: true,
            isPause: false,
            isEnd: false,
          },
          obj: {},
        },
        ceramic: {
          namePhase: "Ceramic",
          actions: [],
          status: {
            isStart: true,
            isPause: false,
            isEnd: false,
          },
          obj: {},
        },
        cadCam: {
          namePhase: "Cad Cam",
          actions: [],
          status: {
            isStart: true,
            isPause: false,
            isEnd: false,
          },
          obj: {},
        },
        designing: {
          namePhase: "Photo",
          actions: [],
          status: {
            isStart: true,
            isPause: false,
            isEnd: false,
          },
          obj: {},
        },
        qualityControl: {
          namePhase: "Quality Control",
          actions: [],
          status: {
            isStart: true,
            isPause: false,
            isEnd: false,
          },
          obj: {},
        },
        receptionPacking: {
          namePhase: "Reception Packing",
          actions: [],
          status: {
            isStart: true,
            isPause: false,
            isEnd: false,
          },
          obj: {},
        },
        delivering: {
          namePhase: "Delivering",
          actions: [],
          status: {
            isStart: true,
            isPause: false,
            isEnd: false,
          },
          obj: {},
        },
        logs: [
          {
            id: user._id,
            name: `${user.firstName} ${user.lastName}`,
            date: new Date(),
            msg: `Create Case by`,
          },
        ],
        deadline: caseModel.dateOut,
        dateReceived: new Date(),
        dateReceivedInEmail: caseModel.dateReceivedInEmail,
        notes: [],
      };
      // console.log(model);
      const response = await fetch(`${_global.BASE_URL}cases`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(model),
      });
      if (response.ok) {
        setIsSubmit(false);
        navigate("/layout/cases");
        showToastMessage("Added Case successfully", "success");
      }
      if (!response.ok) {
        setIsSubmit(false);
        showToastMessage("Error Added Case", "error");
      }
    } else {
      setIsSubmit(false);
      showToastMessage("Please fill All fields have *", "error");
    }
  };
  const chooseTeeth = (item, type) => {
    setNaturalOfWorks(_global.naturalOfWorks);
    setTeethData(item);
  };
  const handleChangeColor = (color) => {
    setNaturalOfTeeth(color);
    const item = naturalOfWorks.find((item) =>
      item.name.toLowerCase().includes(naturalOfTeeth.toLowerCase())
    );
    const teethNumIndex = teethNumbers.findIndex(
      (t) => t.teethNumber === teethData.name
    );
    if (teethNumIndex !== -1) {
      const updatedTeethNumbers = [...teethNumbers];
      // If item already exists, update its color
      updatedTeethNumbers[teethNumIndex].color = item.color;
      updatedTeethNumbers[teethNumIndex].natural = item;
      updatedTeethNumbers[teethNumIndex].name = item.name;
      setTeethNumbers(updatedTeethNumbers);
    } else {
      const updatedTeethNumbers = [...teethNumbers];
      updatedTeethNumbers.push({
        natural: item,
        name: item.name,
        teethNumber: teethData.name,
        color: item.color,
      });
      setTeethNumbers(updatedTeethNumbers);
    }
  };
  const chooseColor = () => {
    handleChangeColor(naturalOfTeeth);
  };
  const resetTeeth = () => {
    const updatedTeethNumbers = [...teethNumbers];
    const afterUpdatedTeethNumbers = updatedTeethNumbers.filter(
      (item) => item.teethNumber !== teethData.name
    );
    setTeethNumbers(afterUpdatedTeethNumbers);
  };
  return (
    <div className="content ">
      <div className="card">
        <h5 class="card-title">New Case</h5>
        <div className="card-body">
          <div class="row">
            <div className="col-lg-12">
              <div className="d-flex justify-content-between">
                <label>Case Type</label>
              </div>
              <div className="type-case">
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="radio"
                    value="Physical"
                    name="caseType"
                    onChange={(e) => setBuffCaseType(e.target.value)}
                    id="flexRadioDefault1"
                    checked={buffCaseType === "Physical"}
                  />
                  <label class="form-check-label" for="flexRadioDefault1">
                    Physical{" "}
                  </label>
                </div>
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="radio"
                    name="caseType"
                    value="Digital"
                    onChange={(e) => setBuffCaseType(e.target.value)}
                    id="flexRadioDefault2"
                    checked={buffCaseType === "Digital"}
                  />
                  <label class="form-check-label" for="flexRadioDefault2">
                    Digital{" "}
                  </label>
                </div>
              </div>
            </div>
            {/* date in */}
            <div className="col-lg-4">
              <div className="form-group">
                <label>
                  DATE IN: <span className="required">*</span>
                </label>
                <input
                  type="date"
                  name="dateIn"
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
            </div>
            <div className="col-lg-4">
              <div className="form-group">
                <label>
                  Due To: <span className="required">*</span>
                </label>
                <input
                  type="date"
                  name="dateOut"
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
            </div>
            {/* <div className="col-lg-4">
              <div className="form-group">
                <label>Deadline:</label>
                <input
                  type="date"
                  name="deadline"
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
            </div> */}
            {buffCaseType === "Digital" && (
              <div className="col-lg-4">
                <div className="form-group">
                  <label>Date Received In Email:</label>
                  <input
                    type="date"
                    name="dateReceivedInEmail"
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
              </div>
            )}
            <div className="col-lg-8">
              <div className="form-group">
                <label>
                  Doctor Name: <span className="required">*</span>
                </label>
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  isLoading={true}
                  // isClearable={true}
                  onChange={(e) => handleChangeSelect(e)}
                  isSearchable={true}
                  name="color"
                  options={doctorsOptions}
                />
                {/* <select
                  className={`form-select`}
                  onChange={handleChangeDentist}
                  name="id"
                >
                  <option selected>Select Doctor Name</option>
                  {doctors.map((doctor, index) => (
                    <option key={index} value={doctor._id}>
                      {doctor.fullName} {doctor.lastName ? doctor.lastName : ""}{" "}
                      ({doctor.clinicName ? doctor.clinicName : ""})
                    </option>
                  ))}
                </select> */}
              </div>
            </div>
            {/* <div className="col-lg-4">
              <div className="form-group">
                <label>Doctor Phone:</label>
                <input
                  type="text"
                  placeholder="Enter Phone"
                  onChange={(e) => setDentistPhone(e.target.value)}
                  className="form-control"
                />
              </div>
            </div> */}
            <div className="col-lg-4">
              <div className="form-group">
                <label>Address:</label>
                <input
                  type="text"
                  name="address"
                  value={caseModel?.address}
                  placeholder="Enter Address"
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
            </div>
            <div className="col-lg-4">
              <div className="form-group">
                <label>
                  Patient Name: <span className="required">*</span>
                </label>
                {/* <input
                  type="text"
                  name="patientName"
                  placeholder="Enter Patient Name"
                  onChange={handleChange}
                  className="form-control"
                /> */}
                <CreatableSelect
                  isClearable
                  onChange={(e) => handleChangeSelectPatient(e)}
                  options={patients}
                />
              </div>
            </div>
            <div className="col-lg-4">
              <div className="form-group">
                <label>Gender: </label>
                <select
                  className={`form-select`}
                  onChange={handleChange}
                  name="gender"
                >
                  <option selected>Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="form-group">
                <label>Patient Age: </label>
                <input
                  type="text"
                  name="age"
                  placeholder="Enter Patient Age"
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
            </div>
            {/* <div className="col-lg-4">
              <div className="form-group">
                <label>Patient Mob:</label>
                <input
                  type="text"
                  name="patientPhone"
                  placeholder="Enter Patient Mobile "
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
            </div> */}
            <div className="col-lg-4">
              <div className="form-group">
                <label>Shade:</label>
                <input
                  type="text"
                  name="shade"
                  placeholder="Enter Shade"
                  onChange={handleChangeShade}
                  className="form-control"
                />
              </div>
            </div>
            <div className="col-lg-4">
              <div className="form-group">
                <label>Stump Shade:</label>
                <input
                  type="text"
                  name="stumpShade"
                  placeholder="Enter Stump Shade"
                  onChange={handleChangeShade}
                  className="form-control"
                />
              </div>
            </div>
            <div className="col-lg-4">
              <div className="form-group">
                <label>Ging Shade:</label>
                <input
                  type="text"
                  name="gingShade"
                  placeholder="Enter Stump Shade "
                  onChange={handleChangeShade}
                  className="form-control"
                />
              </div>
            </div>
            <div className="col-lg-6">
              <div className="form-group checks-box">
                <label> Occlusal Staining:</label>
                <div className="d-flex ">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      value="None"
                      name="occlusalStaining"
                      id="flexCheckDefaultn"
                      onChange={handleChangeOcclusal}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="flexCheckDefaultn"
                    >
                      None
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="occlusalStaining"
                      value="Light"
                      id="flexCheckDefaultl"
                      onChange={handleChangeOcclusal}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="flexCheckDefaultl"
                    >
                      Light
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="occlusalStaining"
                      value="Dark"
                      id="flexCheckCheckedd"
                      onChange={handleChangeOcclusal}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="flexCheckCheckedd"
                    >
                      Dark
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="form-group checks-box">
                <label> Texture:</label>
                <div className="d-flex ">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      value="Smooth"
                      name="texture"
                      id="smooth_id"
                      onChange={handleChangeTexture}
                    />
                    <label className="form-check-label" htmlFor="smooth_id">
                      Smooth
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      value="Moderate"
                      name="texture"
                      id="moderate_id"
                      onChange={handleChangeTexture}
                    />
                    <label className="form-check-label" htmlFor="moderate_id">
                      Moderate
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      value="Heavy"
                      name="texture"
                      id="heavy_id"
                      onChange={handleChangeTexture}
                    />
                    <label className="form-check-label" htmlFor="heavy_id">
                      Heavy
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="form-group checks-box">
                <label> Translucency:</label>
                <div className="d-flex ">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      value="Normal"
                      name="translucency"
                      id="flexCheckDefaultno"
                      onChange={handleChange}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="flexCheckDefaultno"
                    >
                      Normal
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="translucency"
                      value="Cloudy"
                      id="flexCheckDefaultc"
                      onChange={handleChange}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="flexCheckDefaultc"
                    >
                      Cloudy
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="translucency"
                      value="high"
                      id="flexCheckCheckedh"
                      onChange={handleChange}
                    />
                    <label
                      className="form-check-labelh"
                      htmlFor="flexCheckCheckedh"
                    >
                      High
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-12">
              <label>Teeth Numbers </label>
            </div>
            <div class="col-lg-6">
              <div class="teeth-block">
                {numOfTeeth.teeth_top_left
                  .slice()
                  .reverse()
                  .map((item, index) => (
                    <span
                      data-bs-toggle="modal"
                      data-bs-target="#chooseNaturalModal"
                      className="teeth-item"
                      style={{
                        backgroundColor: teethNumbers.find(
                          (t) => t.teethNumber === item.name
                        )
                          ? teethNumbers.find(
                              (t) => t.teethNumber === item.name
                            ).color
                          : "#fff",
                      }}
                      onClick={() => chooseTeeth(item, "teeth_bottom_left")}
                    >
                      {item.name}
                      {teethNumbers.find(
                        (t) => t.teethNumber === item.name
                      ) && (
                        <button
                          type="button"
                          className="teeth-sup"
                          data-bs-toggle="tooltip"
                          data-bs-placement="top"
                          data-bs-target="#staticBackdrop"
                          title={
                            teethNumbers.find(
                              (t) => t.teethNumber === item.name
                            )
                              ? teethNumbers.find(
                                  (t) => t.teethNumber === item.name
                                ).name
                              : ""
                          }
                        >
                          <i class="fa-solid fa-circle-info"></i>
                        </button>
                      )}
                    </span>
                  ))}
              </div>
            </div>
            <div class="col-lg-6">
              <div class="teeth-block">
                {numOfTeeth.teeth_top_right.map((item, index) => (
                  <span
                    data-bs-toggle="modal"
                    data-bs-target="#chooseNaturalModal"
                    className="teeth-item"
                    style={{
                      backgroundColor: teethNumbers.find(
                        (t) => t.teethNumber === item.name
                      )
                        ? teethNumbers.find((t) => t.teethNumber === item.name)
                            .color
                        : "#fff",
                    }}
                    onClick={() => chooseTeeth(item, "teeth_bottom_left")}
                  >
                    {item.name}
                    {teethNumbers.find((t) => t.teethNumber === item.name) && (
                      <button
                        type="button"
                        className="teeth-sup"
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        title={
                          teethNumbers.find((t) => t.teethNumber === item.name)
                            ? teethNumbers.find(
                                (t) => t.teethNumber === item.name
                              ).name
                            : ""
                        }
                      >
                        <i class="fa-solid fa-circle-info"></i>
                      </button>
                    )}

                    {/* <span
                      className="teeth-sup"
                      data-toggle="tooltip"
                      data-placement="right"
                      title={
                        teethNumbers.find((t) => t.teethNumber === item.name)
                          ? teethNumbers.find(
                              (t) => t.teethNumber === item.name
                            ).name
                          : ""
                      }
                    >
                      {teethNumbers.find((t) => t.teethNumber === item.name)
                        ? teethNumbers.find((t) => t.teethNumber === item.name)
                            .name
                        : ""}
                    </span> */}
                  </span>
                ))}
              </div>
            </div>
            <div class="col-lg-6">
              <div class="teeth-block">
                {numOfTeeth.teeth_bottom_left
                  .slice()
                  .reverse()
                  .map((item, index) => (
                    <span
                      data-bs-toggle="modal"
                      data-bs-target="#chooseNaturalModal"
                      className="teeth-item"
                      style={{
                        backgroundColor: teethNumbers.find(
                          (t) => t.teethNumber === item.name
                        )
                          ? teethNumbers.find(
                              (t) => t.teethNumber === item.name
                            ).color
                          : "#fff",
                      }}
                      onClick={() => chooseTeeth(item, "teeth_bottom_left")}
                    >
                      {item.name}
                      {teethNumbers.find(
                        (t) => t.teethNumber === item.name
                      ) && (
                        <button
                          type="button"
                          className="teeth-sup"
                          data-bs-toggle="tooltip"
                          data-bs-placement="top"
                          title={
                            teethNumbers.find(
                              (t) => t.teethNumber === item.name
                            )
                              ? teethNumbers.find(
                                  (t) => t.teethNumber === item.name
                                ).name
                              : ""
                          }
                        >
                          <i class="fa-solid fa-circle-info"></i>
                        </button>
                      )}
                    </span>
                  ))}
              </div>
            </div>
            <div class="col-lg-6">
              <div class="teeth-block">
                {numOfTeeth.teeth_bottom_right.map((item, index) => (
                  <span
                    data-bs-toggle="modal"
                    data-bs-target="#chooseNaturalModal"
                    className="teeth-item"
                    style={{
                      backgroundColor: teethNumbers.find(
                        (t) => t.teethNumber === item.name
                      )
                        ? teethNumbers.find((t) => t.teethNumber === item.name)
                            .color
                        : "#fff",
                    }}
                    onClick={() => chooseTeeth(item, "teeth_bottom_left")}
                  >
                    {item.name}
                    {teethNumbers.find((t) => t.teethNumber === item.name) && (
                      <button
                        type="button"
                        className="teeth-sup"
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        title={
                          teethNumbers.find((t) => t.teethNumber === item.name)
                            ? teethNumbers.find(
                                (t) => t.teethNumber === item.name
                              ).name
                            : ""
                        }
                      >
                        <i class="fa-solid fa-circle-info"></i>
                      </button>
                    )}
                  </span>
                ))}
              </div>
            </div>
            <div className="col-lg-12 mt-4">
              <div className="form-group">
                <div className="d-flex justify-content-between">
                  <label htmlFor="description">
                    {" "}
                    Job Description: <span className="required">*</span>{" "}
                  </label>{" "}
                  <div className="d-flex ">
                    <div class="form-check form-switch">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        name="isStudy"
                        role="switch"
                        checked={caseModel.isStudy} // Ensure controlled component behavior
                        onChange={ (e)=>  setCaseModel((prev) => ({
                          ...prev,
                          ['isStudy']: e.target.checked, // Updates `isStudy` as true/false
                        }))}
                        id="flexSwitchCheckDefault"
                      />
                      <label
                        class="form-check-label"
                        for="flexSwitchCheckDefault"
                      >
                        Study Case
                      </label>
                    </div>
                  </div>
                </div>
                <textarea
                  type="text"
                  id="description"
                  rows={5}
                  className="form-control"
                  name="jobDescription"
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>
            <div className="col-lg-12 btn-add-case">
              <button
                type="button"
                className="btn btn-success"
                onClick={handleSubmit}
                disabled={isSubmit}
              >
                Add
              </button>
            </div>
            <div className="col-lg-12 ">
              <small className="required-note">
                <span className="required">Note: </span>
                <span>
                  All fields marked with an asterisk (
                  <span className="required">* </span> ) are required.
                </span>
              </small>
            </div>
          </div>
        </div>
      </div>
      {/* Modal for Natural of works */}
      <div
        class="modal fade"
        id="chooseNaturalModal"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog ">
          <div class="modal-content">
            <div class="modal-header bg-primary text-white">
              <h1 class="modal-title fs-5" id="exampleModalLabel">
                Teeth {teethData?.name}
              </h1>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                onClick={(e) => resetTeeth()}
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              {naturalOfWorks.map((item, index) => (
                <div className="natural-item">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="color"
                      value={item.name}
                      id={item.name}
                      onChange={(e) => handleChangeColor(e.target.value)}
                    />
                    <label className="form-check-label" htmlFor={item.name}>
                      {item.name}
                    </label>
                  </div>
                  <span
                    className="color-natural"
                    style={{ backgroundColor: item.color }}
                  ></span>
                </div>
              ))}
            </div>
            <div class="modal-footer ">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
                onClick={(e) => resetTeeth()}
              >
                Reset
              </button>
              <button
                type="button"
                onClick={(e) => chooseColor()}
                class="btn btn-success"
                data-bs-dismiss="modal"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AddNewCase;
