import './_textarea.css'

interface Props {
  name: string,
  label: string,
  value?: string | null
}

const TextArea = ({name, label, value}: Props) => (
  <>
    <div className='textarea'>
      <label className='textarea__label' htmlFor={`textarea-${name}`}>{label}</label>
      <textarea className='textarea__input' name={name} id={`textarea-${name}`}>{value}</textarea>
    </div>
  </>
)

export default TextArea