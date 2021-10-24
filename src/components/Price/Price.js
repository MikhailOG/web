import React from 'react';

const Price = () => {
   
    return (
        <div className='price'>
            <h2> Основные расценки </h2>
            <table>
                <caption>
                    <h3>Алмазное бурение (сверление) отверстий</h3>
                </caption>
                <thead>
                    <tr>
                        <th rowSpan="2">Диаметр отверстия, мм</th>
                        <th colSpan="3">Стоимость 1 см бурения в рублях</th>
                    </tr>
                    <tr>
                        <th>Кирпич</th>
                        <th>Неармированный бетон</th>
                        <th>Армированный бетон</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className='top-row'>
                        <td>25-92</td>
                        <td>18</td>
                        <td>18</td>
                        <td>35</td>
                    </tr>
                    <tr>
                        <td>102-122</td>
                        <td>21</td>
                        <td>21</td>
                        <td>38</td>
                    </tr>
                    <tr>
                        <td>132-142</td>
                        <td>24</td>
                        <td>24</td>
                        <td>41</td>
                    </tr>
                    <tr>
                        <td>152-162</td>
                        <td>28</td>
                        <td>28</td>
                        <td>45</td>
                    </tr>
                    <tr>
                        <td>172-192</td>
                        <td>41</td>
                        <td>41</td>
                        <td>65</td>
                    </tr>
                    <tr>
                        <td>200-225</td>
                        <td>47</td>
                        <td>47</td>
                        <td>70</td>
                    </tr>
                    <tr>
                        <td>250</td>
                        <td>50</td>
                        <td>50</td>
                        <td>112</td>
                    </tr>
                    <tr>
                        <td>300</td>
                        <td>78</td>
                        <td>78</td>
                        <td>130</td>
                    </tr>
                    <tr>
                        <td>350</td>
                        <td>107</td>
                        <td>107</td>
                        <td>157</td>
                    </tr>
                    <tr className='bottom-row'>
                        <td>400</td>
                        <td>140</td>
                        <td>140</td>
                        <td>165</td>
                    </tr>
                </tbody>
                <tfoot>

                </tfoot>
            </table>
            <div className="notes">
                <p>К работам повышенной сложности применяются повышающие коэффициенты:</p>
                <ul>
                    <li><i>Устройство отверстий на высоте более 3 метров от пола</i></li>
                    <li><i>Устройство отверстий диаметром более 200 мм при толщине более 400 мм</i></li>
                    <li><i>Устройство отверстий в ж/б конструкциях с повышенной степенью армирования</i></li>
                </ul>
            </div>
            <table>
                <caption>
                    <h3>Алмазная резка стенорезной машиной</h3>
                </caption>
                <thead>
                    <tr>
                        <th rowSpan="2">Толщина стены/перекрытия, см</th>
                        <th colSpan="3">Стоимость 1 м реза в рублях</th>
                    </tr>
                    <tr>
                        <th>Кирпич</th>
                        <th>Неармированный бетон</th>
                        <th>Армированный бетон</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className='top-row'>
                        <td>10</td>
                        <td>600</td>
                        <td>600</td>
                        <td>1000</td>
                    </tr>
                    <tr>
                        <td>11-12</td>
                        <td>700</td>
                        <td>700</td>
                        <td>1200</td>
                    </tr>
                    <tr>
                        <td>13-15</td>
                        <td>900</td>
                        <td>900</td>
                        <td>1400</td>
                    </tr>
                    <tr>
                        <td>16-18</td>
                        <td>1100</td>
                        <td>1100</td>
                        <td>1700</td>
                    </tr>
                    <tr>
                        <td>19-20</td>
                        <td>1200</td>
                        <td>1200</td>
                        <td>2200</td>
                    </tr>
                    <tr>
                        <td>21-22</td>
                        <td>1300</td>
                        <td>1300</td>
                        <td>2700</td>
                    </tr>
                    <tr>
                        <td>23-24</td>
                        <td>1500</td>
                        <td>1500</td>
                        <td>3200</td>
                    </tr>
                    <tr>
                        <td>25-28</td>
                        <td>1800</td>
                        <td>1800</td>
                        <td>3800</td>
                    </tr>
                    <tr>
                        <td>29-30</td>
                        <td>2200</td>
                        <td>2200</td>
                        <td>4300</td>
                    </tr>
                    <tr>
                        <td>31-32</td>
                        <td>2400</td>
                        <td>2400</td>
                        <td>4800</td>
                    </tr>
                    <tr>
                        <td>33-35</td>
                        <td>2600</td>
                        <td>2600</td>
                        <td>5300</td>
                    </tr>
                    <tr className='bottom-row'>
                        <td>36-40</td>
                        <td>2800</td>
                        <td>2800</td>
                        <td>5800</td>
                    </tr>
                </tbody>
                <tfoot>
                </tfoot>
            </table>
            <h3>Алмазная резка канатом</h3>
            <table>
                <thead>
                    <tr>
                        <th rowSpan="2">Толщина стены/перекрытия, см</th>
                        <th colSpan="3">Стоимость 1 м&#178; реза в рублях</th>
                    </tr>
                    <tr>
                        <th>Кирпич</th>
                        <th>Неармированный бетон</th>
                        <th>Армированный бетон</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className='top-row bottom-row'>
                        <td>любая</td>
                        <td>16000</td>
                        <td>16000</td>
                        <td>16000</td>
                    </tr>
                </tbody>
            </table>
            <h3>Устройство металлоконструкций</h3>
            <table>
                <thead>
                    <tr>
                        <th rowSpan="2">Вид работ</th>
                        <th colSpan="3">Стоимость 1 м.п. в рублях</th>
                    </tr>
                    <tr>
                        <th>Уголок L50</th>
                        <th>Уголок L75</th>
                        <th>Уголок L100</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className='top-row bottom-lined'>
                        <td>Обрамление</td>
                        <td>2000</td>
                        <td>2600</td>
                        <td>3600</td>
                    </tr>
                    <tr className='bottom-row'>
                        <td>Усиление</td>
                        <td>2300</td>
                        <td>3100</td>
                        <td>4100</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default Price