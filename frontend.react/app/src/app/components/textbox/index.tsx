import "./_textbox.css"

interface Props {
  name: string
  label: string
  value: string
}

const TextBox = ({name, label, value}: Props) => (
  <>
    <div className="textbox">
      <label className="textbox__label" htmlFor={`textbox-${name}`}>{label}</label>
      <input className="textbox__input" type="text" name={name} id={`textbox-${name}`} defaultValue={value} />
    </div>
  </>
)

export default TextBox