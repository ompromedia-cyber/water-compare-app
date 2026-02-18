function scoreWater(w, profile) {
  // Суточная норма потребления воды (2 литра)
  const liters = 2;
  
  // Получаем значения показателей
  const get = {
    ca: w.ca_mg_l ?? null,
    mg: w.mg_mg_l ?? null,
    k: w.k_mg_l ?? null,
    na: w.na_mg_l ?? null,
    cl: w.cl_mg_l ?? null,
    ph: w.ph ?? null,
    tds: w.tds_mg_l ?? null,
  };

  const cov = dataCoverage(w);
  
  // Массив для хранения отклонений по каждому показателю
  const deviations = [];
  
  // Функция расчета отклонения для одного показателя
  function calculateDeviation(key, refDaily) {
    const x = get[key];
    if (x === null || x === undefined) return null;

    // Для минералов: пересчитываем с учетом 2 литров воды в день
    let valuePerDay = x;
    if (key !== "ph" && key !== "tds") {
      valuePerDay = x * liters; // мг/л * 2 литра = мг/сутки
    }

    let refValue = refDaily;
    if (key === "ph") refValue = REF.ph;
    if (key === "tds") refValue = REF.tds;

    let deviation = 0;
    let description = "";

    // Расчет отклонения в зависимости от показателя
    if (key === "ph") {
      // Для pH идеальный диапазон 6.5-7.5
      if (x >= 6.5 && x <= 7.5) {
        deviation = 0;
        description = "идеальный pH";
      } else if (x < 6.5) {
        deviation = (6.5 - x) * 20; // Чем кислее, тем хуже
        description = "слишком кислая";
      } else {
        deviation = (x - 7.5) * 20; // Чем щелочнее, тем хуже
        description = "слишком щелочная";
      }
    } 
    else if (key === "tds") {
      // Для TDS оптимальный диапазон 100-500 мг/л
      if (x >= 100 && x <= 500) {
        deviation = 0;
        description = "оптимальная минерализация";
      } else if (x < 100) {
        deviation = (100 - x) * 0.5; // Слишком мягкая
        description = "очень мягкая";
      } else {
        deviation = (x - 500) * 0.3; // Слишком минерализованная
        description = "высокая минерализация";
      }
    } 
    else {
      // Для минералов: сравниваем с суточной нормой
      const ratio = valuePerDay / refValue;
      
      if (ratio >= 0.9 && ratio <= 1.1) {
        // В пределах 10% от нормы - идеально
        deviation = 0;
        description = "идеально";
      } 
      else if (ratio < 0.9) {
        // Недостаток
        deviation = (0.9 - ratio) * 100;
        // Чем важнее минерал, тем сильнее штраф за недостаток
        if (key === "ca" || key === "mg") {
          deviation *= 1.2; // Кальций и магний очень важны
        }
        if (key === "na" && profile === "Sport") {
          deviation *= 1.5; // Спортсменам нужен натрий
        }
        description = "недостаток";
      } 
      else {
        // Избыток
        deviation = (ratio - 1.1) * 150; // Избыток штрафуется сильнее
        if (key === "na" || key === "cl") {
          deviation *= 1.5; // Натрий и хлориды вредны в избытке
        }
        if (key === "na" && profile === "Pressure") {
          deviation *= 2.0; // Для гипертоников избыток натрия критичен
        }
        description = "избыток";
      }
    }

    // Ограничиваем максимальное отклонение
    deviation = Math.min(deviation, 100);
    
    return { deviation, description, value: x, ratio: valuePerDay / refValue };
  }

  // Собираем отклонения по всем показателям
  const caDev = calculateDeviation("ca", REF.ca);
  const mgDev = calculateDeviation("mg", REF.mg);
  const kDev = calculateDeviation("k", REF.k);
  const naDev = calculateDeviation("na", REF.na);
  const clDev = calculateDeviation("cl", REF.cl);
  const phDev = calculateDeviation("ph", REF.ph);
  const tdsDev = calculateDeviation("tds", REF.tds);

  // Считаем общий штраф
  let totalPenalty = 0;
  let metricsCount = 0;

  if (caDev) { totalPenalty += caDev.deviation; metricsCount++; }
  if (mgDev) { totalPenalty += mgDev.deviation; metricsCount++; }
  if (kDev) { totalPenalty += kDev.deviation * 0.7; metricsCount++; } // Калий менее важен
  if (naDev) { totalPenalty += naDev.deviation; metricsCount++; }
  if (clDev) { totalPenalty += clDev.deviation; metricsCount++; }
  if (phDev) { totalPenalty += phDev.deviation * 0.8; metricsCount++; } // pH менее критичен
  if (tdsDev) { totalPenalty += tdsDev.deviation * 0.6; metricsCount++; } // TDS тоже

  // Средний штраф на один показатель
  const avgPenalty = metricsCount > 0 ? totalPenalty / metricsCount : 0;

  // Базовый счет: 100 минус средний штраф
  let score = 100 - avgPenalty;

  // Штраф за отсутствие данных
  const missingCount = cov.total - cov.count;
  score -= missingCount * 8; // -8 за каждый отсутствующий показатель

  // Бонус за полные данные
  if (cov.count === cov.total) {
    score += 5; // +5 если есть все показатели
  }

  // Штраф за лечебную категорию
  if (computeCategory(w) === "Therapeutic") {
    score -= 25; // Лечебные воды сильно штрафуются для daily рейтинга
  }

  // Финальное ограничение
  score = clamp(score, 0, 100);

  // Формируем topReasons (показатели с наибольшими отклонениями)
  const allDeviations = [
    { key: "ca", ...caDev },
    { key: "mg", ...mgDev },
    { key: "k", ...kDev },
    { key: "na", ...naDev },
    { key: "cl", ...clDev },
    { key: "ph", ...phDev },
    { key: "tds", ...tdsDev },
  ].filter(d => d.deviation !== undefined && d.deviation > 10); // Только значимые отклонения

  allDeviations.sort((a, b) => b.deviation - a.deviation);
  
  const topReasons = allDeviations.slice(0, 3).map(d => ({
    key: d.key,
    deviation: d.deviation,
    description: d.description
  }));

  return {
    score: Math.round(score * 10) / 10, // Округляем до 1 знака
    category: computeCategory(w),
    coverageCount: cov.count,
    coverageTotal: cov.total,
    hasMin: cov.count === cov.total,
    topReasons: topReasons.map(r => r.key),
    details: {
      ca: caDev,
      mg: mgDev,
      k: kDev,
      na: naDev,
      cl: clDev,
      ph: phDev,
      tds: tdsDev,
      avgPenalty,
      totalPenalty,
    }
  };
}
