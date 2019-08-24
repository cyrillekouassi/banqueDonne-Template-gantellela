//var baseUrl = "https://play.dhis2.org/2.28";
//var login = "admin:district";
var baseUrl = "https://sigsante.gouv.ci/dhis";
var login = "cyrille kouassi:Rylco2016#";
var auth = window.btoa(login);

var banque = angular.module('banqueIndex', ['ngResource','chart.js']);
banque.config(['$httpProvider', function ($httpProvider) {

    $httpProvider.defaults.headers.common['Authorization'] = 'Basic ' + auth;

}]);

banque.run(['$rootScope','$http', function ($rootScope,$http) {
    console.log("entrer dans banqueIndex");
    var meUrl = baseUrl + '/api/me/';
    //getMe();

    function getMe() {
        console.log("Entrer dans getMe");
        $http.get(meUrl).then(function (succes) {
            console.log("saveData() succes = ", succes);
        }, function (error) {
            console.error("getMe() error = ", error);
        });
    }

}]);

banque.controller('indexCTRL',['$scope','$http',function ($scope,$http) {
    console.log("entrer dans indexCTRL");
    var meUrl = baseUrl + '/api/me/';
    $scope.colours = ['#3498DB',
        "#9B59B6",
        "#E74C3C",
        "#26B99A",
        '#F1C40F',
        "#3498DB",
        '#72C02C',
        '#717984',
        "#BDC3C7"];

    var compteElement = 0;

    var elementValue = [];
    var elementdonut = [];
    var elementpie = [];
    var dataCourbe = [];
    $scope.elementValueAffiche = [];


    declareVariableNombre();
    variableCourbe();
    declareDonut();
    declarePie();
    allerElement();
    getCourbeValue();
    getDonutValue();
    getPieValue();

    function declareVariableNombre() {
        var element0 = {
            name: "Nombre de femmes enceintes reçues en CPN1 et se connaissant déjà séropositive au VIH",
            nameId: 'U3YQks0pUgt',
            periode: "derniers trimestre",
            periodeId: 'LAST_QUARTER',
            organisation: "Côte d'Ivoire",
            organisationId: "ZD44Asc0bAk"
        };
        elementValue.push(element0);
        var element1 = {
            name: "Nombre de femmes enceintes conseillées et testées qui ont reçues leur résultat du test VIH en CPN et Maternité_2015",
            nameId: 'CuwuNAZ07Pm',
            periode: "derniers trimestre",
            periodeId: 'LAST_QUARTER',
            organisation: "Côte d'Ivoire",
            organisationId: "ZD44Asc0bAk"
        };
        elementValue.push(element1);
        var element2 = {
            name: "Nombre de femmes enceintes dépistées séropositives au VIH_2015",
            nameId: 'dDDEBjP12cx',
            periode: "derniers trimestre",
            periodeId: 'LAST_QUARTER',
            organisation: "Côte d'Ivoire",
            organisationId: "ZD44Asc0bAk"
        };
        elementValue.push(element2);
        var element3 = {
            name: "Nombre de femmes enceintes déjà sous traitement ARV et reçu en CPN1_2015",
            nameId: 'tAwB6yAZ8ld',
            periode: "derniers trimestre",
            periodeId: 'LAST_QUARTER',
            organisation: "Côte d'Ivoire",
            organisationId: "ZD44Asc0bAk"
        };
        elementValue.push(element3);
        var element4 = {
            name: "Nombre d'enfants nés vivants de mères séropositives au VIH",
            nameId: 'CSMNDrXkjJn',
            periode: "derniers trimestre",
            periodeId: 'LAST_QUARTER',
            organisation: "Côte d'Ivoire",
            organisationId: "ZD44Asc0bAk"
        };
        elementValue.push(element4);
        var element5 = {
            name: "Nombre d'enfants nés de mères séropositives au VIH ayant reçu des ARV dans les 72h après la naissance",
            nameId: 'CX86wvwahei',
            periode: "derniers trimestre",
            periodeId: 'LAST_QUARTER',
            organisation: "Côte d'Ivoire",
            organisationId: "ZD44Asc0bAk"
        };
        elementValue.push(element5);


    }
    function restituerValue() {
        console.log("restituerValue()");
        $scope.elementValueAffiche = elementValue;
    }

    function allerElement() {
        if(compteElement < elementValue.length){
            constiVariable();
        }else{
            restituerValue();

        }
    }

    function constiVariable() {
        console.log("constiVariable()");
        var element = elementValue[compteElement].nameId;
        var periode = elementValue[compteElement].periodeId;
        var organisation = elementValue[compteElement].organisationId;
        // console.log("constiVariable() > lesElements = ", lesElements);
        // console.log("constiVariable() > lesPeriodes = ", lesPeriodes);
        // console.log("constiVariable() > lesOrganisations = ", lesOrganisations);

        getValue(element,periode,organisation);
    }

    function getValue(element,periode,organisation) {
        //console.log("getValue()");
        var analyticUrl = baseUrl + "/api/analytics?";
        //console.log("getdata(), analyticData = ",analyticData);
        var lesElementDim = "dimension=dx:" + element;
        var lesPeriodeDim = "dimension=pe:" + periode;
        var organisation = "filter=ou:" + organisation;
        var analyticData = analyticUrl+lesElementDim+"&"+lesPeriodeDim+"&"+organisation;
        var header = {"Authorization": "Basic " + auth};
        $http.get(analyticData,{headers: header}).then(function (succes) {
            //console.log("getValue() succes = ", succes);
            valueObtenu(succes.data)
        }, function (error) {
            //console.log("getValue() error = ", error);
        });
    }

    function valueObtenu(data) {
        //console.log("valueObtenu()");
        var valeur = [];
        var dx = data.metaData.dimensions.dx[0];
        var pe = data.metaData.dimensions.pe[0];
        var ou = data.metaData.dimensions.ou[0];
        elementValue[compteElement].name = data.metaData.items[dx].name;
        elementValue[compteElement].periode = data.metaData.items[pe].name;
        elementValue[compteElement].organisation = data.metaData.items[ou].name;
        valeur = data.rows[0];
        elementValue[compteElement].value = Number(valeur[2]);
        //console.log("valueObtenu() elementValue[compteElement] = ",elementValue[compteElement]);

        compteElement++;
        allerElement();
    }
    
    function variableCourbe() {
        var courbe0 = {
            name: "Nombre d'enfants nés de mères séropositives au VIH dépistés précocement (avant 2 mois)",
            nameId: 's4M1F5TGIUT',
            periode: "derniers trimestre",
            periodeId: 'LAST_6_MONTHS',
            organisation: "Côte d'Ivoire",
            organisationId: "ZD44Asc0bAk"
        };
        dataCourbe.push(courbe0);
        var courbe1 = {
            name: "Nombre d'enfants nés de mères séropositives au VIH dépistés précocement (2 à 9 mois)",
            nameId: 'CqH0OEPxlmI',
            periode: "derniers trimestre",
            periodeId: 'LAST_6_MONTHS',
            organisation: "Côte d'Ivoire",
            organisationId: "ZD44Asc0bAk"
        };
        dataCourbe.push(courbe1);
        var courbe2 = {
            name: "Nombre d'enfants nés de mères séropositives au VIH dépistés tardivement (10 à 18 mois)_2015",
            nameId: 'XUQBRGmn9sH',
            periode: "derniers trimestre",
            periodeId: 'LAST_6_MONTHS',
            organisation: "Côte d'Ivoire",
            organisationId: "ZD44Asc0bAk"
        };
        dataCourbe.push(courbe2);
    }

    function constiCourbe(dataCourbe) {
        var variable = {};
        variable.element = "";
        variable.periode = "";
        variable.organisation = "";
        for(var i = 0;i<dataCourbe.length;i++){
            if(variable.element.indexOf(dataCourbe[i].nameId) == -1){
                if(variable.element == null)
                    variable.element = dataCourbe[i].nameId;
                else
                    variable.element = variable.element + ";"+dataCourbe[i].nameId;
            }
            if(variable.periode.indexOf(dataCourbe[i].periodeId) == -1){
                if(variable.periode == null)
                    variable.periode = dataCourbe[i].periodeId;
                else
                    variable.periode = variable.periode + ";"+dataCourbe[i].periodeId;
            }
            if(variable.organisation.indexOf(dataCourbe[i].organisationId) == -1){
                if(variable.organisation == null)
                    variable.organisation = dataCourbe[i].organisationId;
                else
                    variable.organisation = variable.organisation + ";"+dataCourbe[i].organisationId;
            }
        }
        return variable;
        //getCourbeValue(element,periode,organisation);
    }

    function getCourbeValue() {
        var variable = constiCourbe(dataCourbe);
        console.log("getCourbeValue()");
        var analyticUrl = baseUrl + "/api/analytics?";
        console.log("getdata(), analyticData = ",analyticData);
        var lesElementDim = "dimension=dx:" + variable.element;
        var lesPeriodeDim = "dimension=pe:" + variable.periode;
        var organisation = "filter=ou:" + variable.organisation;
        var analyticData = analyticUrl+lesElementDim+"&"+lesPeriodeDim+"&"+organisation;
        var header = {"Authorization": "Basic " + auth};
        $http.get(analyticData,{headers: header}).then(function (succes) {
            console.log("getCourbeValue() succes = ", succes);
            courbe1(succes.data);
        }, function (error) {
            console.error("getCourbeValue() error = ", error);
        });
    }

    function courbe1(data) {
        $scope.courbe1 = courbeObtenu(data);
    }
    function courbeObtenu(data) {
        //console.log("courbeObtenu()");
        var elementCourbe = {};
        elementCourbe.periode = [];
        elementCourbe.element = [];
        elementCourbe.organisation = [];
        elementCourbe.data = [];
        var valeur = [];
        var dx = [];
        var pe = [];
        var ou = [];
        var dx = data.metaData.dimensions.dx;
        var pe = data.metaData.dimensions.pe;
        var ou = data.metaData.dimensions.ou;
        for(var i = 0;i<pe.length;i++){
            elementCourbe.periode.push(data.metaData.items[pe[i]].name);
        }
        for(var i = 0;i<dx.length;i++){
            elementCourbe.element.push(data.metaData.items[dx[i]].name);
        }
        for(var i = 0;i<ou.length;i++){
            elementCourbe.organisation.push(data.metaData.items[ou[i]].name);
        }

        for(var i = 0;i<dx.length;i++){
            valeur = [];
            for(var a = 0;a<pe.length;a++){

                for(var j = 0; j<data.rows.length;j++){
                    var ligne = data.rows[j];
                    if(dx[i] == ligne[0] && pe[a] == ligne[1]){
                        valeur.push(Number(ligne[2]));
                    }
                }
            }
            elementCourbe.data.push(valeur);
        }


        console.log("courbeObtenu() elementCourbe = ",elementCourbe);
        return elementCourbe;

    }

    function declareDonut() {
        var donut0 = {
            name: "Nombre de conjoints de femmes enceintes séropositives au VIH dépistés_2015 Positifs_2015",
            nameId: 'EdXFh4ttdjx.K1PNhWCHK7k',
            periode: "derniers trimestre",
            periodeId: 'LAST_QUARTER',
            organisation: "Côte d'Ivoire",
            organisationId: "ZD44Asc0bAk"
        };
        elementdonut.push(donut0);
        var donut1 = {
            name: "Nombre de conjoints de femmes enceintes séropositives au VIH dépistés_2015 Négatifs_2015",
            nameId: 'EdXFh4ttdjx.iezBfej7QhT',
            periode: "derniers trimestre",
            periodeId: 'LAST_QUARTER',
            organisation: "Côte d'Ivoire",
            organisationId: "ZD44Asc0bAk"
        };
        elementdonut.push(donut1);
    }
    function getDonutValue() {
        console.log("getDonutValue()");
        var variable = constiCourbe(elementdonut);

        var analyticUrl = baseUrl + "/api/analytics?";
        console.log("getdata(), analyticData = ",analyticData);
        var lesElementDim = "dimension=dx:" + variable.element;
        var lesPeriodeDim = "dimension=pe:" + variable.periode;
        var organisation = "filter=ou:" + variable.organisation;
        var analyticData = analyticUrl+lesElementDim+"&"+lesPeriodeDim+"&"+organisation;
        var header = {"Authorization": "Basic " + auth};
        $http.get(analyticData,{headers: header}).then(function (succes) {
            console.log("getDonutValue() succes = ", succes);
            //donutObtenu(succes.data);
            donut1(succes.data);
        }, function (error) {
            console.error("getDonutValue() error = ", error);
        });
    }

    function donutObtenu(data) {
        console.log("donutObtenu()");
        var elementCourbe = {};
        elementCourbe.periode = [];
        elementCourbe.element = [];
        elementCourbe.organisation = [];
        elementCourbe.data = [];
        var valeur = [];
        var dx = [];
        var pe = [];
        var ou = [];
        var dx = data.metaData.dimensions.dx;
        var pe = data.metaData.dimensions.pe;
        var ou = data.metaData.dimensions.ou;
        for(var i = 0;i<pe.length;i++){
            elementCourbe.periode.push(data.metaData.items[pe[i]].name);
        }
        for(var i = 0;i<dx.length;i++){
            elementCourbe.element.push(data.metaData.items[dx[i]].name);
        }
        for(var i = 0;i<ou.length;i++){
            elementCourbe.organisation.push(data.metaData.items[ou[i]].name);
        }

        for(var i = 0;i<dx.length;i++){
            valeur = [];
            for(var a = 0;a<pe.length;a++){

                for(var j = 0; j<data.rows.length;j++){
                    var ligne = data.rows[j];
                    if(dx[i] == ligne[0] && pe[a] == ligne[1]){
                        elementCourbe.data.push(Number(ligne[2]));
                    }
                }
            }
        }


        console.log("donutObtenu() elementCourbe = ",elementCourbe);
        return elementCourbe;
    }
    function donut1(data) {
        $scope.donut1 = {};
        $scope.donut1 = donutObtenu(data);
        $scope.donut1.options = {
            legend: {display: true}
        }
    }
    
    function declarePie() {
        var pie0 = {
            name: "Nombre de conjoints de femmes enceintes séronégatives au VIH dépistés_2015 Positifs_2015",
            nameId: 'IBASwNZ6L9Y.K1PNhWCHK7k',
            periode: "derniers trimestre",
            periodeId: 'LAST_QUARTER',
            organisation: "Côte d'Ivoire",
            organisationId: "ZD44Asc0bAk"
        };
        elementpie.push(pie0);
        var pie1 = {
            name: "Nombre de conjoints de femmes enceintes séronégatives au VIH dépistés_2015 Négatifs_2015",
            nameId: 'IBASwNZ6L9Y.iezBfej7QhT',
            periode: "derniers trimestre",
            periodeId: 'LAST_QUARTER',
            organisation: "Côte d'Ivoire",
            organisationId: "ZD44Asc0bAk"
        };
        elementpie.push(pie1);
    }

    function getPieValue() {
        console.log("getDonutValue()");
        var variable = constiCourbe(elementpie);

        var analyticUrl = baseUrl + "/api/analytics?";
        console.log("getdata(), analyticData = ",analyticData);
        var lesElementDim = "dimension=dx:" + variable.element;
        var lesPeriodeDim = "dimension=pe:" + variable.periode;
        var organisation = "filter=ou:" + variable.organisation;
        var analyticData = analyticUrl+lesElementDim+"&"+lesPeriodeDim+"&"+organisation;
        var header = {"Authorization": "Basic " + auth};
        $http.get(analyticData,{headers: header}).then(function (succes) {
            console.log("getPieValue() succes = ", succes);
            pie1(succes.data)
        }, function (error) {
            console.error("getPieValue() error = ", error);
        });
    }
    function pie1(data) {
        $scope.pie1 = {};
        $scope.pie1 = donutObtenu(data);
        $scope.pie1.options = {
            legend: {display: true}
        }
    }

    $scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
    $scope.series = ['Series A', 'Series B'];
    $scope.data = [
    [65, 59, 80, 81, 56, 55, 40],
        [28, 48, 40, 19, 86, 27, 90]
];
    $scope.onClick = function (points, evt) {
        console.log(points, evt);
    };
    //$scope.datasetOverride = [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }];
    $scope.options = {
        legend: {display: true},
        scales: {
            yAxes: [
                {
                    id: 'y-axis-1',
                    type: 'linear',
                    display: true,
                    position: 'left'
                },
                {
                    id: 'y-axis-2',
                    type: 'linear',
                    display: false,
                    position: 'right'
                }
            ]
        }
    };


}]);
