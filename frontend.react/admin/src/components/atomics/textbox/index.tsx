import './_textbox.css'

interface Props {
  id: string
}

const TextBox = ({id}: Props) => (
  <>
    <input id={id} className="text-box" type="text" />
  </>
)

export default TextBox;