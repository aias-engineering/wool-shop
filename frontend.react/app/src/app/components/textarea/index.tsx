import './_textarea.css'

interface Props {
  name: string,
  label: string
}

const TextArea = ({name, label}: Props) => (
  <>
    <div className='textarea'>
      <label className='textarea__label' htmlFor={`textarea-${name}`}>{label}</label>
      <textarea className='textarea__input' name={name} id={`textarea-${name}`}>

      </textarea>
    </div>
  </>
)

export default TextArea