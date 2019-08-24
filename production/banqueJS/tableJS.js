//var baseUrl = "https://play.dhis2.org/2.28";
//var login = "admin:district";
var baseUrl = "https://sigsante.gouv.ci/dhis";
var login = "cyrille kouassi:Rylco2016#";
var auth = window.btoa(login);

var banque = angular.module('banqueTable', ['ngResource','tree_directive']);
banque.config(['$httpProvider', function ($httpProvider) {

    $httpProvider.defaults.headers.common['Authorization'] = 'Basic ' + auth;

}]);

banque.run(['$rootScope','$http', function ($rootScope,$http) {
    console.log("entrer dans banqueTable");
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

banque.controller('tableCTRL',['$scope','$http','orgUnitResource','dataElementsResource','indicateursResource','dataElementOperands',
    function ($scope,$http,orgUnitResource,dataElementsResource,indicateursResource,dataElementOperands) {
    console.log("entrer dans tableCTRL");
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
    var meDataView = [];
    var allOrgUnit = [];
    var page = 1;
    var pageCount = 0;
    $scope.ListDataElement = [];

    getMe();
    getElement();
    getIndateur();

    function getMe() {
        console.log("Entrer dans getMe");
        $http.get(meUrl).then(function (succes) {
            console.log("saveData() succes = ", succes);
            meDataView = succes.data.dataViewOrganisationUnits;
            getOrgUnit();
        }, function (error) {
            console.log("getMe() error = ", error);
        });
    }

    function getOrgUnit() {
        console.log("Entrer dans getOrgUnit");
        orgUnitResource.query({
            paging: false,
            fields: 'id,name,parent,code,description,children,level'
        }, function (data) {
            console.log("data = ", data);
            allOrgUnit = data.organisationUnits;
            dataArbre();
        }, function (err) {
            console.log("echec de collection de tout en une fois");
           getOrgUnitDetail();
        });
    }

    function getOrgUnitDetail() {
        console.log("entrer dans getOrgUnitDetail()");
        $rootScope.patientez = true;
        orgUnitResource.query({
            pageSize: 300,
            fields: 'id,name,parent,code,description,children,level'
        }, function (data) {
            //console.log("resultat positif getOrgUnitDetail");
            //console.log(data);
            allOrgUnit = [];
            if (data.pager.pageCount) {
                page = 1;
                pageCount = data.pager.pageCount;
                //console.log("pageCount = "+pageCount);
                allOrgUnit = data.organisationUnits;
                $rootScope.nbreTelecharger = 1;
                $rootScope.nbreTotal = pageCount;
                if (pageCount > page) {
                    page++;
                    getOrgUnitID();
                }
            }
            //getOrgUnitID();
        }, function (err) {

        });

    }

    function getOrgUnitID() {
        console.log("entrer dans getOrgUnitID()");
        orgUnitResource.query({
            page: page,
            pageSize: 300,
            fields: 'id,name,parent,code,description,children,level'
        }, function (data) {
            var tempo = [];
            tempo = angular.copy(allOrgUnit);
            allOrgUnit = tempo.concat(data.organisationUnits);
            if (pageCount > page) {
                page++;
                $rootScope.nbreTelecharger++;
                getOrgUnitID();
            } else {
                console.log("fin de collect orgUnits dans getOrgUnitID()");
                //console.log($rootScope.allOrgUnit);
                dataArbre();
            }
        }, function (err) {

        });
    }

    function getOrgLevelOne() {
        for (var i = 0; i < allOrgUnit.length; i++) {
            if (allOrgUnit[i].level == 1) {
                meDataView.push({id: allOrgUnit[i].id});
            }
        }
    }

    function dataArbre() {
        //console.log("meDataView = ", meDataView);
        if (meDataView.length == 0) {
            getOrgLevelOne();
        }
        //console.log("meDataView = ", angular.copy(meDataView));
        var a = 0, b = meDataView.length;
        while (a < b) {
            for (var i = 0, j = allOrgUnit.length; i < j; i++) {
                if (meDataView[a].id === allOrgUnit[i].id) {
                    meDataView[a] = allOrgUnit[i];
                    //meDataView[a].children = allOrgUnit[i].childrens;
                    //delete meDataView[a].childrens;
                    if (meDataView[a].children.length > 0) {
                        meDataView[a].collapse = true;
                        meDataView[a].children = getChildren(meDataView[a].children);
                        meDataView[a].children = ordreName(meDataView[a].children)
                    }
                    break;
                }
            }
            a++;
        }
        console.log("entrer meDataView = ", angular.copy(meDataView));
        $scope.arbre = meDataView;

    }

    function ordreName(orgUnitCollec) {
        //console.log("entrer orgUnitCollec = ", angular.copy(orgUnitCollec));
        orgUnitCollec.sort(function (a, b) {
            if (a.name > b.name) {
                return 1;
            }
            if (a.name < b.name) {
                return -1;
            }
            return 0;
        });
        return orgUnitCollec;
        //console.log("sortir orgUnitCollec = ", angular.copy(orgUnitCollec));
    }

    function getChildren(child) {
        //console.log("getChildren");
        var a = 0, b = child.length;
        while (a < b) {
            for (var i = 0, j = allOrgUnit.length; i < j; i++) {
                if (child[a].id === allOrgUnit[i].id) {
                    child[a] = allOrgUnit[i];
                    //child[a].children = allOrgUnit[i].childrens;
                    //delete child[a].childrens;
                    if (child[a].children.length > 0) {
                        child[a].children = getChildren(child[a].children);
                        child[a].children = ordreName(child[a].children)
                    }
                    break;
                }
            }
            a++;
        }
        return child;
    }

    function getElement(){

        dataElementsResource.query({
            fields: 'id,displayName'
        }, function (data) {
            console.log("getElement() data = ", data);
            //$rootScope.ListDataElement = data.dataElements;
            $scope.ListDataElement = $scope.ListDataElement.concat(data.dataElements);
            // for(var i =0;i<$rootScope.ListDataElement.length;i++){
            //     $rootScope.ListDataElement[i].type = "dataElement";
            // }
        }, function (err) {
            console.log("echec getElement() ,err = ",err);

        });
    }

    function getIndateur(){

        indicateursResource.query({
            fields: 'id,displayName'
        }, function (data) {
            console.log("getIndateur() data = ", data);
            //$rootScope.ListDataElement = data.indicators;
            $scope.ListDataElement = $scope.ListDataElement.concat(data.indicators);
            // for(var i =0;i<$rootScope.ListDataElement.length;i++){
            //     $rootScope.ListDataElement[i].type = "indicator";
            // }

        }, function (err) {
            console.log("echec getIndateur() ,err = ",err);

        });
    }
    
    function displayDetails() {
        dataElementOperands.query({
            //fields: 'id,displayName'
        }, function (data) {
            console.log("displayDetails() data = ", data);
            $scope.ListDataElement = $scope.ListDataElement.concat(data.dataElementOperands);


        }, function (err) {
            console.log("echec displayDetails() ,err = ",err);

        });
    }

    $scope.DetailsValue = function (value) {
        console.log("DetailsValue() value = ",value);
        $scope.ListDataElement = [];
        getIndateur();
        if(value){
            displayDetails();
        }else{
            getElement();
        }
    }
}]);
