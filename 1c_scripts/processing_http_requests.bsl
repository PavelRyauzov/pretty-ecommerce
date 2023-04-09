Функция ПолучитьДанныеНоменклатуры() Экспорт
		
	// Характеристики номенклатуры
	МассивХарактеристикиНоменклатуры = ПолучитьХарактеристикиНоменклатурыМассив();
		
	// Виды номенклатуры	
	МассивВидыНоменклатуры = ПолучитьВидыНоменклатурыМассив();
	
	// Марки (бренды)
	МассивМарки = ПолучитьМаркиМассив();
		
	// Товары из номенклатуры
	МассивТовары = ПолучитьТоварыМассив();
	
	// Валюты
	МассивВалюты = ПолучитьВалютыМассив();
	
	// Виды цен
	МассивВидыЦен = ПолучитьВидыЦенМассив();
	
	// Цены на товары
	МассивЦеныНаТовары = ПолучитьЦеныНаТоварыМассив();
	
	// Склады
	МассивСклады = ПолучитьСкладыМассив();
	
	// Остатки товаров по складам
	МассивОстаткиТоваровПоСкладам = ПолучитьОстаткиТоваровПоСкладамМассив();

	КорневойОбъект = Новый Структура;
	КорневойОбъект.Вставить("product_characteristic", МассивХарактеристикиНоменклатуры);
	КорневойОбъект.Вставить("product_type", МассивВидыНоменклатуры); 
	КорневойОбъект.Вставить("product_brand", МассивМарки);
	КорневойОбъект.Вставить("product", МассивТовары);
	КорневойОбъект.Вставить("currency", МассивВалюты);
	КорневойОбъект.Вставить("price_type", МассивВидыЦен);
	КорневойОбъект.Вставить("product_price", МассивЦеныНаТовары);
	КорневойОбъект.Вставить("warehouse", МассивСклады);
	КорневойОбъект.Вставить("stock_balance", МассивОстаткиТоваровПоСкладам);
		
	ЗаписьJSON = Новый ЗаписьJSON;
	ЗаписьJSON.УстановитьСтроку();
	ЗаписатьJSON(ЗаписьJSON, КорневойОбъект);
	СтрокаJSON = ЗаписьJSON.Закрыть();
	
	Возврат СтрокаJSON;
	
КонецФункции

Функция ПолучитьХарактеристикиНоменклатурыМассив()
	Запрос = Новый Запрос;
	
	Запрос.Текст =  
	"ВЫБРАТЬ 
	| ХарактеристикиНоменклатуры.Ссылка КАК Ссылка,
	| ХарактеристикиНоменклатуры.Владелец КАК Владелец_ВК,
	| ХарактеристикиНоменклатуры.Наименование КАК Наименование,
	| ХарактеристикиНоменклатуры.НаименованиеПолное КАК НаименованиеПолное
	|ИЗ 
	| Справочник.ХарактеристикиНоменклатуры КАК ХарактеристикиНоменклатуры";
	
	Выборка = Запрос.Выполнить().Выбрать();  
	
	МассивХарактеристикиНоменклатуры = Новый Массив;
	Пока Выборка.Следующий()Цикл
		ХарактеристикаНоменклатуры = Новый Структура;
		ХарактеристикаНоменклатуры.Вставить("external_id", "" + Выборка.Ссылка.УникальныйИдентификатор());
		ХарактеристикаНоменклатуры.Вставить("external_product_id", "" + Выборка.Владелец_ВК.УникальныйИдентификатор());
		ХарактеристикаНоменклатуры.Вставить("title", Выборка.Наименование);
		ХарактеристикаНоменклатуры.Вставить("description", Выборка.НаименованиеПолное);
		МассивХарактеристикиНоменклатуры.Добавить(ХарактеристикаНоменклатуры);
	КонецЦикла;
	
	Возврат МассивХарактеристикиНоменклатуры;
	
КонецФункции

Функция ПолучитьВидыНоменклатурыМассив()
	
	Запрос = Новый Запрос;
	
	Запрос.Текст = 
	"ВЫБРАТЬ 
	| ВидыНоменклатуры.Ссылка КАК Ссылка,
	| ВидыНоменклатуры.Наименование КАК Наименование
	|ИЗ 
	| Справочник.ВидыНоменклатуры КАК ВидыНоменклатуры";

	Выборка = Запрос.Выполнить().Выбрать();
	
	МассивВидыНоменклатуры = Новый Массив;
	Пока Выборка.Следующий()Цикл
		ВидНоменклатуры = Новый Структура;
		ВидНоменклатуры.Вставить("external_id", "" + Выборка.Ссылка.УникальныйИдентификатор());
		ВидНоменклатуры.Вставить("name", Выборка.Наименование);
		МассивВидыНоменклатуры.Добавить(ВидНоменклатуры);
	КонецЦикла;
	
	Возврат МассивВидыНоменклатуры;
	
КонецФункции

Функция ПолучитьМаркиМассив()
	
	Запрос = Новый Запрос;
	
	Запрос.Текст = 
	"ВЫБРАТЬ 
	| Марки.Ссылка КАК Ссылка,
	| Марки.Наименование КАК Наименование,
	| Марки.Производитель КАК Производитель
	|ИЗ 
	| Справочник.Марки КАК Марки";

	Выборка = Запрос.Выполнить().Выбрать();
	
	МассивМарки = Новый Массив;
	Пока Выборка.Следующий()Цикл
		Марка = Новый Структура;
		Марка.Вставить("external_id", "" + Выборка.Ссылка.УникальныйИдентификатор());
		Марка.Вставить("name", Выборка.Наименование);
		Марка.Вставить("manufacturer", "" + Выборка.Производитель);
		МассивМарки.Добавить(Марка);
	КонецЦикла;

	Возврат МассивМарки;
	
КонецФункции

Функция ПолучитьТоварыМассив()
	
	Запрос = Новый Запрос;

	Запрос.Текст = 
	"ВЫБРАТЬ 
	| Номенклатура.Ссылка КАК Ссылка,
	| Номенклатура.Наименование КАК Наименование,
	| Номенклатура.Артикул КАК Артикул,
	| Номенклатура.ВидНоменклатуры КАК ВидНоменклатуры_ВК,
	| Номенклатура.Марка КАК Марка_ВК
	|ИЗ 
	| Справочник.Номенклатура КАК Номенклатура";

	Выборка = Запрос.Выполнить().Выбрать();
	
	МассивТовары = Новый Массив;
	Пока Выборка.Следующий() Цикл  
		Товар = Новый Структура;
		Товар.Вставить("external_id", "" + Выборка.Ссылка.УникальныйИдентификатор());
		Товар.Вставить("name", Выборка.Наименование);
		
		Артикул = Выборка.Артикул;
		Товар.Вставить("vendor_code", ?(ЗначениеЗаполнено(Артикул) И Артикул <> Null, Артикул, ""));
		
		Товар.Вставить("price", 5);
		
		// Картинки из присоединенных файлов номенклатуры		
		МассивКартинки = ПолучитьКартинкиТовараМассив(Выборка.Ссылка);
		Товар.Вставить("img", МассивКартинки);
		
		ВидНоменклатуры_ВК = Выборка.ВидНоменклатуры_ВК;
		Товар.Вставить("external_type_id", ?(ЗначениеЗаполнено(ВидНоменклатуры_ВК) И ВидНоменклатуры_ВК <> Null, "" + ВидНоменклатуры_ВК.УникальныйИдентификатор(), ""));
		
		Марка_ВК = Выборка.Марка_ВК;
		Товар.Вставить("external_brand_id", ?(ЗначениеЗаполнено(Марка_ВК) И Марка_ВК <> Null, "" + Марка_ВК.УникальныйИдентификатор(), ""));
		
		МассивТовары.Добавить(Товар);
	КонецЦикла;

	Возврат МассивТовары;
	
КонецФункции

Функция ПолучитьКартинкиТовараМассив(ТоварСсылка)
	
	Запрос = Новый Запрос;
	
	Запрос.Текст = 
	"ВЫБРАТЬ 
	| НоменклатураПрисоединенныеФайлы.Ссылка КАК ФайлКартинки,
	| НоменклатураПрисоединенныеФайлы.Расширение КАК ФорматФайлаКартинки
	|ИЗ 
	| Справочник.НоменклатураПрисоединенныеФайлы КАК НоменклатураПрисоединенныеФайлы
	|ГДЕ
	| НоменклатураПрисоединенныеФайлы.ВладелецФайла = &ВладелецСсылка";
	Запрос.УстановитьПараметр("ВладелецСсылка", ТоварСсылка);
		
	Выборка = Запрос.Выполнить().Выбрать();
		
	МассивКартинки = Новый Массив;
	Пока Выборка.Следующий() Цикл
		Картинка = Новый Структура;
		ФорматФайлаКартинки = Выборка.ФорматФайлаКартинки;
		ФайлКартинки = Выборка.ФайлКартинки;
		Картинка.Вставить("format", ?(ЗначениеЗаполнено(ФорматФайлаКартинки) И ФорматФайлаКартинки <> Null, ФорматФайлаКартинки, ""));
		Картинка.Вставить("base64", ?(ЗначениеЗаполнено(ФайлКартинки) И ФайлКартинки <> Null, ПолучитьКартинку(ФайлКартинки), ""));
		МассивКартинки.Добавить(Картинка);
	КонецЦикла;

	Возврат МассивКартинки;
	
КонецФункции

&НаСервере
Функция ПолучитьКартинку(СсылкаНаФайл)
	
	Если ЗначениеЗаполнено(СсылкаНаФайл) Тогда
    	 ДвоичныеДанные = РаботаСФайлами.ДвоичныеДанныеФайла(СсылкаНаФайл);
    	 Возврат Base64Строка(ДвоичныеДанные);   	
	КонецЕсли;
	 
КонецФункции

Функция ПолучитьВидыЦенМассив()
	
	Запрос = Новый Запрос;
	
	Запрос.Текст = 
	"ВЫБРАТЬ 
	| ВидыЦен.Ссылка КАК Ссылка,
	| ВидыЦен.Наименование КАК Наименование,
	| ВидыЦен.ВалютаЦены КАК ВалютаЦены
	|ИЗ 
	| Справочник.ВидыЦен КАК ВидыЦен";

	Выборка = Запрос.Выполнить().Выбрать();
	
	МассивВидыЦен = Новый Массив;
	Пока Выборка.Следующий()Цикл
		ВидЦены = Новый Структура;
		ВидЦены.Вставить("external_id", "" + Выборка.Ссылка.УникальныйИдентификатор());
		ВидЦены.Вставить("name", Выборка.Наименование);
		ВидЦены.Вставить("сurrency", "" + Выборка.ВалютаЦены.УникальныйИдентификатор());
		МассивВидыЦен.Добавить(ВидЦены);
	КонецЦикла;

	Возврат МассивВидыЦен;
	
КонецФункции

Функция ПолучитьВалютыМассив()
	
	Запрос = Новый Запрос;
	
	Запрос.Текст = 
	"ВЫБРАТЬ 
	| Валюты.Ссылка КАК Ссылка,
	| Валюты.Наименование КАК Наименование
	|ИЗ 
	| Справочник.Валюты КАК Валюты";

	Выборка = Запрос.Выполнить().Выбрать();
	
	МассивВалюты = Новый Массив;
	Пока Выборка.Следующий()Цикл
		Валюта = Новый Структура;
		Валюта.Вставить("external_id", "" + Выборка.Ссылка.УникальныйИдентификатор());
		Валюта.Вставить("name", Выборка.Наименование);
		МассивВалюты.Добавить(Валюта);
	КонецЦикла;

	Возврат МассивВалюты;
	
КонецФункции

Функция ПолучитьЦеныНаТоварыМассив()
	
	Запрос = Новый Запрос;
	
	Запрос.Текст = 
	"ВЫБРАТЬ 
	| ЦеныНоменклатуры.Номенклатура КАК Номенклатура_ВК,
	| ЦеныНоменклатуры.Характеристика КАК ХарактеристикаНоменклатуры_ВК,
	| ЦеныНоменклатуры.ВидЦены КАК ВидЦены,
	| ЦеныНоменклатуры.Цена КАК Цена
	|ИЗ 
	| РегистрСведений.ЦеныНоменклатуры.СрезПоследних КАК ЦеныНоменклатуры";

	Выборка = Запрос.Выполнить().Выбрать();
	
	МассивЦеныНаТовары = Новый Массив;
	Пока Выборка.Следующий()Цикл
		ЦенаНаТовар = Новый Структура;
		ХарактеристикаНоменклатуры_ВК = Выборка.ХарактеристикаНоменклатуры_ВК;
		
		Если ЗначениеЗаполнено(ХарактеристикаНоменклатуры_ВК) И ХарактеристикаНоменклатуры_ВК <> Null Тогда
			ЦенаНаТовар.Вставить("external_product_id", неопределено);
        	ЦенаНаТовар.Вставить("external_product_characteristic_id", "" + ХарактеристикаНоменклатуры_ВК.УникальныйИдентификатор());
		Иначе
        	ЦенаНаТовар.Вставить("external_product_id", "" + Выборка.Номенклатура_ВК.УникальныйИдентификатор());
			ЦенаНаТовар.Вставить("external_product_characteristic_id", неопределено);
		КонецЕсли;
		
		ЦенаНаТовар.Вставить("external_price_type_id", "" + Выборка.ВидЦены.УникальныйИдентификатор());
		ЦенаНаТовар.Вставить("price_value", Выборка.Цена);
		МассивЦеныНаТовары.Добавить(ЦенаНаТовар);
	КонецЦикла;

	Возврат МассивЦеныНаТовары;
	
КонецФункции

Функция ПолучитьСкладыМассив()
	
	Запрос = Новый Запрос;
	
	Запрос.Текст = 
	"ВЫБРАТЬ 
	| Склады.Ссылка КАК Ссылка,
	| Склады.Наименование КАК Наименование
	|ИЗ 
	| Справочник.Склады КАК Склады";

	Выборка = Запрос.Выполнить().Выбрать();
	
	МассивСклады = Новый Массив;
	Пока Выборка.Следующий()Цикл
		Склад = Новый Структура;
		Склад.Вставить("external_id", "" + Выборка.Ссылка.УникальныйИдентификатор());
		Склад.Вставить("name", Выборка.Наименование);
		МассивСклады.Добавить(Склад);
	КонецЦикла;

	Возврат МассивСклады;
	
КонецФункции

Функция ПолучитьОстаткиТоваровПоСкладамМассив()
	
	Запрос = Новый Запрос;
	
	Запрос.Текст = 
	"ВЫБРАТЬ
 	| СвободныеОстаткиОстатки.Номенклатура КАК Номенклатура,
    | СвободныеОстаткиОстатки.Склад КАК Склад,
 	| СвободныеОстаткиОстатки.ВНаличииОстаток - СвободныеОстаткиОстатки.ВРезервеСоСкладаОстаток - СвободныеОстаткиОстатки.ВРезервеПодЗаказОстаток КАК ДоступноОстаток
	|ИЗ
 	| РегистрНакопления.СвободныеОстатки.Остатки КАК СвободныеОстаткиОстатки";

	Выборка = Запрос.Выполнить().Выбрать();
	
	МассивОстаткиТоваровПоСкладам = Новый Массив;
	Пока Выборка.Следующий()Цикл
		ОстатокТовараПоСкладу = Новый Структура;
		ОстатокТовараПоСкладу.Вставить("external_product_id", "" + Выборка.Номенклатура.УникальныйИдентификатор());
		ОстатокТовараПоСкладу.Вставить("external_warehouse_id", "" + Выборка.Склад.УникальныйИдентификатор());
		ОстатокТовараПоСкладу.Вставить("available_balance", Выборка.ДоступноОстаток);
		МассивОстаткиТоваровПоСкладам.Добавить(ОстатокТовараПоСкладу);
	КонецЦикла;

	Возврат МассивОстаткиТоваровПоСкладам;
	
КонецФункции