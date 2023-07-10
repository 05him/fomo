export const InputField = ({ label, inputType, placeholder }) => {
    return <div className="input-field" > 
        <label> {label} <input type={inputType} placeholder={placeholder} /> </label>
         </div>
}