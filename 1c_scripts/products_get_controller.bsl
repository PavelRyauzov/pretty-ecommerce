Функция ProductsGET(Запрос)
	
	
    Ответ = Новый HTTPСервисОтвет(200);
    Результат = ОбработкаHttpЗапросов.ПолучитьДанныеНоменклатуры();
    Ответ.УстановитьТелоИзСтроки(Результат, КодировкаТекста.UTF8);
    Ответ.Заголовки.Вставить("Content-Type", "application/json; charset=utf-8");
    Возврат Ответ;

КонецФункции