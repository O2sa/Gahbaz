import React, {useState} from 'react'
import PropTypes from 'prop-types'
// import { SpecialCard } from '../components/Specialcard'
import { CCol, CRow, CForm, CFormControlValidation, CFormLabel, CInputGroup, CInputGroupText, CFormSelect, CFormFeedback,CFormCheck, CButton} from '@coreui/react'
import { Input } from './Input'

export const Form = ({ textarea, ...props }) => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    comment: "",
    isMale: true,
    employment: "",
    favColor: "",
  });

  function handlChange(event) {
    let { name, type, checked, value } = event.target;
    console.log('event', event.target)

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: type === "checkbox" ? checked : value,
    }));

  }

  function handleSubmit(event){
    event.preventDefault();
    console.log(formData);

  }
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>First Name</label>
        <input
          onChange={handlChange}
          placeholder="First Name"
          type="text"
          name="first_name"
          value={formData.first_name}
        ></input>{" "}
        <br />
        <label>Last Name</label>
        <input
          onChange={handlChange}
          placeholder="Last Name"
          type="text"
          name="last_name"
          value={formData.last_name}
        ></input>{" "}
        <br />
        <label>Email</label>
        <input
          onChange={handlChange}
          placeholder="Email"
          type="text"
          name="email"
          value={formData.email}
        ></input>
        <br />
        <label>comment</label>
        <textarea
          name="comment"
          onChange={handlChange}
          value={formData.comment}
        />
        <br />
        <input
          type="checkbox"
          name="isMale"
          checked={formData.isMale}
          onChange={handlChange}
        />
        <label htmlFor="isMale">Are you a male?</label>
        <br />
        <fieldset>
          <legend>Current employment Status</legend>
          <input
            type="radio"
            id="unemployed"
            value="unemployed"
            name="employment"
            onChange={handlChange}
            checked={formData.employment === "unemployed"}
          />
          <label htmlFor="unemployed">unemployed</label>
          <br />{" "}
          <input
            type="radio"
            id="part-time"
            value="part-time"
            onChange={handlChange}
            name="employment"
            checked={formData.employment === "part-time"}
          />
          <label htmlFor="part-time">part-time</label>
          <br />{" "}
          <input
            type="radio"
            id="full-time"
            value="full-time"
            onChange={handlChange}
            checked={formData.employment === "full-time"}
            name="employment"
          />
          <label htmlFor="full-time">full-time</label>
          <br />
        </fieldset>
        <br />
        <label htmlFor="favColor">Your favorite color</label>
        <br />
        <select name="favColor" id="favColor" value={formData.favColor} onChange={handlChange}>
          <option value="">-- Choose --</option>
          <option value="red">Red</option>
          <option value="blue">Blue</option>
          <option value="orange">Orange</option>
          <option value="black">black</option>
        </select>
        <br/>
        <br/>
        <button>Submit</button>
      </form>
      <h2>
        Hello {formData.first_name} {formData.last_name},<br />
        Your Email :{formData.email}, <br />
        comment: {formData.comment},<br />
        you are male: {formData.isMale ? "True" : "False"}
        <br />
        employment status: {formData.employment}
        <br />
        Your favorite Color: {formData.favColor}
      </h2>
    </div>
  );
}
