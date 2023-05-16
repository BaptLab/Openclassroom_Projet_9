/**
 * @jest-environment jsdom
 */

import { screen, fireEvent, waitFor, getByTestId } from "@testing-library/dom";
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";
import userEvent from "@testing-library/user-event";
import { setEmployeePage } from "./Bills.js";
import { ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import router from "../app/Router.js";

async function setNewBillPage() {
  document.body.innerHTML = "";
  Object.defineProperty(window, "localStorage", { value: localStorageMock });
  window.localStorage.setItem(
    "user",
    JSON.stringify({
      type: "Employee",
    })
  );
  //rendu de la page
  const root = document.createElement("div");
  root.setAttribute("id", "root");
  document.body.append(root);
  router();
  window.onNavigate(ROUTES_PATH.Bills);
  await waitFor(() => screen.getByTestId("btn-new-bill"));
  userEvent.click(screen.getByTestId("btn-new-bill"));
  await waitFor(() => screen.getByTestId("form-new-bill"));
}

function delay(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    beforeEach(async () => {
      await setNewBillPage();
    });

    //OK
    test("Then it should render the new bill form", async () => {
      expect(
        (screen.getByTestId("newbill-header").innerText = "Envoyer une note de frais")
      ).toBeTruthy();
    });

    describe("When I do not fill any fields and I click on the submit button", () => {
      test("Then it should render the NewBill page", async () => {
        //Check if we are on the correct page
        expect(
          (screen.getByTestId("newbill-header").innerText = "Envoyer une note de frais")
        ).toBeTruthy();

        const inputExpenseType = screen.getByTestId("expense-type");
        const inputDateUser = screen.getByTestId("datepicker");
        const inputTVAPct = screen.getByTestId("pct");
        const inputTTCAmount = screen.getByTestId("amount");
        const inputSupportingDoc = screen.getByTestId("file");

        const submitBtn = document.querySelector("#btn-send-bill");
        submitBtn.addEventListener("click", (e) => {
          if (
            inputExpenseType.value == "" ||
            inputDateUser.value == "" ||
            inputTVAPct.value == "" ||
            inputTTCAmount.value == "" ||
            inputSupportingDoc.value == ""
          ) {
            e.preventDefault();
          }
        });

        submitBtn.click();
        await delay(500);

        expect(
          (screen.getByTestId("newbill-header").innerText = "Envoyer une note de frais")
        ).toBeTruthy();
      });
    });

    describe("When I do fill all the required fields and I click on the submit button", () => {
      test("Then it should render the Bill page", async () => {
        //Check if we are on the correct page
        expect(
          (screen.getByTestId("newbill-header").innerText = "Envoyer une note de frais")
        ).toBeTruthy();

        const inputExpenseType = screen.getByTestId("expense-type");
        const inputDateUser = screen.getByTestId("datepicker");
        const inputTVAPct = screen.getByTestId("pct");
        const inputTTCAmount = screen.getByTestId("amount");
        const inputSupportingDoc = screen.getByTestId("file");

        fireEvent.change(inputExpenseType, { target: { value: "Transports" } });
        expect(inputExpenseType.value).toBe("Transports");

        fireEvent.change(inputDateUser, { target: { value: "2023-05-06" } });
        expect(inputDateUser.value).toBe("2023-05-06");

        fireEvent.change(inputTVAPct, { target: { value: "5" } });
        expect(inputTVAPct.value).toBe("5");

        fireEvent.change(inputTTCAmount, { target: { value: "200" } });
        expect(inputTTCAmount.value).toBe("200");

        const file = new File([""], "mock.png", { type: "image/png" });
        Object.defineProperty(inputSupportingDoc, "files", {
          value: [file],
        });
        fireEvent.change(inputSupportingDoc);
        expect(inputSupportingDoc.files[0].name).toBe("mock.png");

        /* console.log(
          inputExpenseType.value,
          inputDateUser.value,
          inputTVAPct.value,
          inputTTCAmount.value,
          inputSupportingDoc.files[0].name
        ); */

        const submitBtn = document.querySelector("#btn-send-bill");
        submitBtn.addEventListener("click", (e) => {
          if (
            inputExpenseType.value == "" ||
            inputDateUser.value == "" ||
            inputTVAPct.value == "" ||
            inputTTCAmount.value == "" ||
            inputSupportingDoc.files[0].name == ""
          ) {
            e.preventDefault();
          }
        });

        submitBtn.click();
        await delay(500);

        /*         screen.debug(undefined, Infinity);
         */

        expect(
          screen.getByTestId("btn-new-bill").innerHTML === "Nouvelle note de frais"
        ).toBeTruthy();
      });
    });
  });
});
