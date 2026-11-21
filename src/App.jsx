
import { useState } from 'react'
import {
  Calculator,
  RotateCcw,
  Utensils,
  Users,
  Baby,
  Coffee,
  Receipt,
  CheckCircle2
} from 'lucide-react'
import './App.css'

const ADULT_PRICE = 299
const CHILD_PRICE = 89
const REFILL_PRICE = 29
const WATER_PRICE = 10
const SODA_PRICE = 25

const initialForm = {
  adults: '',
  children: '',
  drinkType: 'refill',
  water: '',
  soda: '',
  discount: '0'
}

function App() {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [result, setResult] = useState(null)

  const updateField = (field, value) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }))

    setErrors(prev => ({
      ...prev,
      [field]: ''
    }))

    setResult(null)
  }

  const formatMoney = (number) => {
    return Number(number).toLocaleString('th-TH', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  }

  const calculate = () => {
    const newErrors = {}

    const adults = form.adults === '' ? 0 : Number(form.adults)
    const children = form.children === '' ? 0 : Number(form.children)
    const water = form.water === '' ? 0 : Number(form.water)
    const soda = form.soda === '' ? 0 : Number(form.soda)

    // ตรวจสอบว่ากรอกจำนวนผู้ใช้บริการอย่างน้อยหนึ่งช่อง
    if (form.adults === '' && form.children === '') {
      newErrors.people = 'กรุณากรอกจำนวนผู้ใหญ่หรือจำนวนเด็ก'
    }

    // ตรวจสอบจำนวนผู้ใหญ่
    if (
      form.adults !== '' &&
      (!Number.isInteger(adults) || adults < 0)
    ) {
      newErrors.adults = 'กรุณากรอกจำนวนผู้ใหญ่เป็นจำนวนเต็มตั้งแต่ 0 ขึ้นไป'
    }

    // ตรวจสอบจำนวนเด็ก
    if (
      form.children !== '' &&
      (!Number.isInteger(children) || children < 0)
    ) {
      newErrors.children = 'กรุณากรอกจำนวนเด็กเป็นจำนวนเต็มตั้งแต่ 0 ขึ้นไป'
    }

    // ตรวจสอบจำนวนเครื่องดื่มแบบขวด
    if (form.drinkType === 'bottle') {
      if (
        form.water !== '' &&
        (!Number.isInteger(water) || water < 0)
      ) {
        newErrors.water = 'กรุณากรอกจำนวนขวดเป็นจำนวนเต็มตั้งแต่ 0 ขึ้นไป'
      }

      if (
        form.soda !== '' &&
        (!Number.isInteger(soda) || soda < 0)
      ) {
        newErrors.soda = 'กรุณากรอกจำนวนขวดเป็นจำนวนเต็มตั้งแต่ 0 ขึ้นไป'
      }
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) {
      setResult(null)
      return
    }

    // คำนวณค่าอาหาร
    const foodCost =
      adults * ADULT_PRICE +
      children * CHILD_PRICE

    // คำนวณค่าเครื่องดื่ม
    let drinkCost = 0

    if (form.drinkType === 'refill') {
      drinkCost = (adults + children) * REFILL_PRICE
    } else {
      drinkCost =
        water * WATER_PRICE +
        soda * SODA_PRICE
    }

    // รวมค่าอาหารและเครื่องดื่ม
    const subtotal = foodCost + drinkCost

    // คำนวณส่วนลด
    const discountRate = Number(form.discount) / 100
    const discountAmount = subtotal * discountRate

    // ยอดสุทธิ
    const total = subtotal - discountAmount

    setResult({
      adults,
      children,
      water: form.drinkType === 'bottle' ? water : 0,
      soda: form.drinkType === 'bottle' ? soda : 0,
      foodCost,
      drinkCost,
      subtotal,
      discountRate,
      discountAmount,
      total
    })
  }

  const resetForm = () => {
    setForm(initialForm)
    setErrors({})
    setResult(null)
  }

  return (
    <main className="app-container">
      <div className="calculator-card">

        {/* Header */}
        <header className="header">
          <div className="header-icon">
            <Utensils size={25} />
          </div>

          <h1>Buffet Calculator</h1>
          <p>คำนวณค่าอาหารบุฟเฟต์</p>

          <div className="restaurant-logo">
            <span>🍽️</span>
            <strong>Buffet</strong>
            <small>Restaurant</small>
          </div>
        </header>

        {/* Form */}
        <section className="form-section">

          {/* จำนวนผู้ใหญ่ */}
          <div className="form-group">
            <label htmlFor="adults">
              <Users size={15} />
              จำนวนผู้ใหญ่
              <span className="price-label">(คนละ {ADULT_PRICE} บาท)</span>
            </label>

            <input
              id="adults"
              type="number"
              min="0"
              step="1"
              placeholder="กรอกจำนวนผู้ใหญ่"
              value={form.adults}
              onChange={(e) => updateField('adults', e.target.value)}
              className={errors.adults || errors.people ? 'input-error' : ''}
            />

            {errors.adults && (
              <p className="error-message">{errors.adults}</p>
            )}
          </div>

          {/* จำนวนเด็ก */}
          <div className="form-group">
            <label htmlFor="children">
              <Baby size={15} />
              จำนวนเด็ก
              <span className="price-label">(คนละ {CHILD_PRICE} บาท)</span>
            </label>

            <input
              id="children"
              type="number"
              min="0"
              step="1"
              placeholder="กรอกจำนวนเด็ก"
              value={form.children}
              onChange={(e) => updateField('children', e.target.value)}
              className={errors.children || errors.people ? 'input-error' : ''}
            />

            {errors.children && (
              <p className="error-message">{errors.children}</p>
            )}

            {errors.people && (
              <p className="error-message">{errors.people}</p>
            )}
          </div>

          {/* เครื่องดื่ม */}
          <div className="drink-section">
            <label className="section-title">
              <Coffee size={16} />
              เครื่องดื่ม
            </label>

            <label className="radio-option">
              <input
                type="radio"
                name="drinkType"
                value="refill"
                checked={form.drinkType === 'refill'}
                onChange={() => {
                  updateField('drinkType', 'refill')
                  setForm(prev => ({
                    ...prev,
                    drinkType: 'refill',
                    water: '',
                    soda: ''
                  }))
                }}
              />

              <span>
                น้ำรีฟิล คนละ {REFILL_PRICE} บาท
                (ผู้ใหญ่และเด็ก)
              </span>
            </label>

            <label className="radio-option">
              <input
                type="radio"
                name="drinkType"
                value="bottle"
                checked={form.drinkType === 'bottle'}
                onChange={() => updateField('drinkType', 'bottle')}
              />

              <span>เครื่องดื่มแบบขวด</span>
            </label>

            {form.drinkType === 'bottle' ? (
              <div className="bottle-fields">
                <div className="form-group">
                  <label htmlFor="water">
                    น้ำเปล่า (ขวดละ {WATER_PRICE} บาท)
                  </label>

                  <input
                    id="water"
                    type="number"
                    min="0"
                    step="1"
                    placeholder="จำนวนขวดน้ำเปล่า"
                    value={form.water}
                    onChange={(e) => updateField('water', e.target.value)}
                    className={errors.water ? 'input-error' : ''}
                  />

                  {errors.water && (
                    <p className="error-message">{errors.water}</p>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="soda">
                    น้ำอัดลม (ขวดละ {SODA_PRICE} บาท)
                  </label>

                  <input
                    id="soda"
                    type="number"
                    min="0"
                    step="1"
                    placeholder="จำนวนขวดน้ำอัดลม"
                    value={form.soda}
                    onChange={(e) => updateField('soda', e.target.value)}
                    className={errors.soda ? 'input-error' : ''}
                  />

                  {errors.soda && (
                    <p className="error-message">{errors.soda}</p>
                  )}
                </div>
              </div>
            ) : (
              <p className="drink-note">
                <CheckCircle2 size={14} />
                เลือกน้ำรีฟิลแล้ว ไม่ต้องกรอกจำนวนเครื่องดื่มแบบขวด
              </p>
            )}
          </div>

          {/* ส่วนลด */}
          <div className="form-group discount-group">
            <label htmlFor="discount">
              <Receipt size={15} />
              บัตรส่วนลด
            </label>

            <select
              id="discount"
              value={form.discount}
              onChange={(e) => updateField('discount', e.target.value)}
            >
              <option value="0">ไม่มีส่วนลด</option>
              <option value="10">ส่วนลด 10%</option>
              <option value="15">ส่วนลด 15%</option>
              <option value="20">ส่วนลด 20%</option>
            </select>

            <small className="hint">
              เลือกส่วนลดที่ต้องการเพื่อคำนวณยอดสุทธิ
            </small>
          </div>

          {/* Buttons */}
          <div className="button-group">
            <button className="calculate-btn" onClick={calculate}>
              <Calculator size={17} />
              คำนวณ
            </button>

            <button className="reset-btn" onClick={resetForm}>
              <RotateCcw size={17} />
              รีเซ็ต
            </button>
          </div>
        </section>

        {/* Result */}
        <section className="result-section">
          {result ? (
            <div className="result-content">
              <h2>สรุปค่าใช้จ่าย</h2>

              <div className="result-row">
                <span>ค่าอาหาร</span>
                <strong>{formatMoney(result.foodCost)} บาท</strong>
              </div>

              <div className="result-row">
                <span>ค่าเครื่องดื่ม</span>
                <strong>{formatMoney(result.drinkCost)} บาท</strong>
              </div>

              <div className="result-row">
                <span>ยอดก่อนหักส่วนลด</span>
                <strong>{formatMoney(result.subtotal)} บาท</strong>
              </div>

              <div className="result-row discount-result">
                <span>ส่วนลด ({form.discount}%)</span>
                <strong>
                  -{formatMoney(result.discountAmount)} บาท
                </strong>
              </div>

              <div className="result-divider" />

              <div className="total-row">
                <span>ยอดชำระทั้งหมด</span>
                <strong>{formatMoney(result.total)} บาท</strong>
              </div>

              <p className="success-message">
                <CheckCircle2 size={15} />
                คำนวณเรียบร้อยแล้ว
              </p>
            </div>
          ) : (
            <div className="empty-result">
              <span>ยอดชำระทั้งหมด</span>
              <strong>0.00 <small>บาท</small></strong>
              <p>กรอกข้อมูลแล้วกดปุ่มคำนวณ</p>
            </div>
          )}
        </section>

        <footer className="footer">
          <p>Buffet Calculator © 2026</p>
          <p>คำนวณค่าอาหารบุฟเฟต์อย่างง่าย</p>
        </footer>

      </div>
    </main>
  )
}

export default App
