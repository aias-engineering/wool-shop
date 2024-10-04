import { ReactNode } from "react";
import './_grid-form.css'
import Title from "../../atomics/title";
import Button from "../../atomics/button";

interface Props {
    children?: ReactNode
}

const GridForm = ({children}: Props) => (
  <>
    <form className="grid-form">
      {children}
    </form>
  </>
)

export const GridFormTitle = ({children}: Props) => (
  <>
    <Title as="h3" className="grid-form__title">{children}</Title>
  </>
)

interface LabeledInputProps {
  label: string,
  id: string,
  type?: 'text'
}

export const GridFormInput = ({id, label, type = 'text'}: LabeledInputProps) => (
  <>
    <label htmlFor={id} className="grid-form__input-label">{label}</label>
    <input type={type} id={id} className="grid-form__input" />
  </>
)

export const GridFormButton = ({children}: Props) => (
  <>
    <Button className="grid-form__input">{children}</Button>
  </>
)

export default GridForm;