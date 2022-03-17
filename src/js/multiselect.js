// The languages currently in use
var options = [
    { text: "Arabic", selected: true, disabled: false, hidden: false },
    { text: "Belarusian", selected: true, disabled: true, hidden: true },
    { text: "Chinese", selected: true, disabled: false, hidden: false },
    { text: "Dutch", selected: true, disabled: false, hidden: false },
    { text: "English", selected: false, disabled: false, hidden: false },
    { text: "French", selected: false, disabled: false, hidden: false },
    { text: "Greek", selected: false, disabled: false, hidden: false },
    { text: "Hindi", selected: false, disabled: false, hidden: false },
    { text: "Italian", selected: false, disabled: false, hidden: false }
];

// Disable the language part or hide the language part.
var $management = $('#languages-hidden-id, #languages-disabled-id');

function resetManagement() {

    function createData(property) {
        var dataHTML = '';
        for (var i = 0; i < options.length; i++) {
            var option = options[i];

            // This will be added to the select options of either the disabled or the hidden
            dataHTML += ('<option ' + (option[property] ? "selected" : "") + ' value="' + option.text + '"  data-index="' + i + '">' + option.text + '</option>');
        }
        return dataHTML;
    }

    $('#languages-hidden-id').html(createData('hidden'));
    $('#languages-disabled-id').html(createData('disabled'));
}

// Calling the function above
resetManagement();

var languages1 = null;
var languages2 = null;
let isLanguages2 = true;
var $languages = $('#languages1-id')
if (isLanguages2)
    $languages = $languages.add('#languages2-id')
var callMs = function (id, process) { return $(id).each(function (i, e) { let ms = $(e).data("DashboardCode.BsMultiSelect"); if (ms) process(ms); }) }

$management.bsMultiSelect(
    function (e, c) {
        c.setSelected = function (eo, v) {
            eo.selected = v;
            var index = $(eo).data("index");

            if (e.id == "languages-hidden-id") {
                options[index].hidden = v;
                callMs($languages, function (ms) { ms.updateOptionHidden(index) })
            } else if (e.id == "languages-disabled-id") {
                options[index].disabled = v;
                callMs($languages, function (ms) { ms.updateOptionDisabled(index) })
            }
        }
    }
);


// Get the attached data
var getIsAttached = function () { return $languages.data("DashboardCode.BsMultiSelect") != null }
var disabled = false;
var disabledOptions = false;

var install = function () {
    $languages.bsMultiSelect({
        options: options,
        getDisabled: function () { return disabled },
        getIsOptionDisabled: function (option) { return option.disabled },
        getIsOptionHidden: function (option) { return option.hidden }
    });
    if (isLanguages2) {
        $('#languages1-id').on('dashboardcode.multiselect:change', function () {
            $('#languages2-id').bsMultiSelect("UpdateOptionsSelected");
        })
        $('#languages2-id').on('dashboardcode.multiselect:change', function () {
            $('#languages1-id').bsMultiSelect("UpdateOptionsSelected");
        })
    }
}
install();


$('#btnAttach').click(
    function () {
        if (getIsAttached()) {
            $languages.bsMultiSelect("Dispose");
            $languages.unbind();
        }
        else {
            install();
        }
    }
);

$('#btnDisable').click(
    function () {
        if (getIsAttached()) {
            disabled = !disabled;
            $languages.bsMultiSelect("UpdateDisabled");
        }
    }
);

$('#btnDisableOptions').click(
    function () {
        if (getIsAttached()) {
            disabledOptions = !disabledOptions;
            $languages.bsMultiSelect("UpdateOptionsDisabled");
        }
    }
);

// Button to remove 
$('#btnRemove').click(
    function () {
        var inputValue = $("#inputValue").val();
        if (inputValue) {
            var position = -1;

            // Options is the data up there in an array
            for (var i = 0; i < options.length; i++) {
                var item = options[i];

                // Text is the text like French, chinese
                if (item.text.toLowerCase() == inputValue.toLowerCase()) {
                    position = i;
                    break;
                }
            }

            if (position >= 0) {
                
                // To remove to the array
                options.splice(position, 1);

                // resetManagement called so as to remove to the front end the option added
                resetManagement();

                $management.bsMultiSelect("UpdateData");
                if (getIsAttached()) {
                    callMs('#languages1-id', function (ms) { ms.updateOptionRemoved(position) })
                    callMs('#languages2-id', function (ms) { ms.updateOptionRemoved(position) })
                }
            }
        }
    }
)

// Button to add
$('#btnAddSelected').click(
    function () {
        var inputValue = $("#inputValue").val();
        if (inputValue) {
            var position = -1;
            for (var i = 0; i < options.length; i++) {
                var item = options[i];

                // If text to be added is same as one that already exists
                if (item.text.toLowerCase() == inputValue.toLowerCase())
                    return;
                // 
                else if (item.text.toLowerCase() > inputValue.toLowerCase())
                    break;
            }
            position = i;
            if (position >= 0) {
                options.splice(position, 0, { text: inputValue, selected: true, disabled: false, hidden: false });
                resetManagement();
                $management.bsMultiSelect("UpdateData");
                if (getIsAttached()) {
                    callMs('#languages1-id', function (ms) { ms.updateOptionAdded(position) })
                    callMs('#languages2-id', function (ms) { ms.updateOptionAdded(position) })
                }
            }
        }
    }
);