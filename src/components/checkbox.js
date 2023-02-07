import React from "react";
import { to_title } from "../assets/js/utils/functions";

const Checkbox = ({ title, type, name, _id, action, checked }) => {
  return (
    <div className="form-group smalls" key={_id}>
      <input
        id={_id}
        className="checkbox-custom"
        name={name}
        type={type || "checkbox"}
        checked={checked}
        onChange={() => action(_id)}
      />
      <label for={_id} className="checkbox-custom-label">
        {to_title(title)}
      </label>
    </div>
  );
};

export default Checkbox;
