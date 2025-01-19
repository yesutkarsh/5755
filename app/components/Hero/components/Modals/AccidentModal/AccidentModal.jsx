import React from 'react'
import styles from './styles.module.css'
import Accidents from '@/app/Analytics/Components/MyMap/Accidents'
export default function AccidentModal() {
  return (
    <div className={styles.modal}>
    <Accidents/>
    </div>
  )
}
