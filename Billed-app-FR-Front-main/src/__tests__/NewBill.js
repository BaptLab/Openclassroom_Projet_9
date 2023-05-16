/**
 * @jest-environment jsdom
 */

import { screen, fireEvent } from "@testing-library/dom";
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";
import userEvent from "@testing-library/user-event";

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    beforeEach(() => {
      document.body.innerHTML = NewBillUI();
    });

    describe("When I do not fill fields and I click on the submit button", () => {
      test("Then it should render the NewBill page", () => {
        const submitBtn = document.querySelector("#btn-send-bill");
        userEvent.click(submitBtn);
        expect(screen.getByTestId("form-new-bill")).toBeTruthy();
      });
    });

    describe("When I do only fill fields the date field and I click on the submit button", () => {
      test("Then it should render the NewBill page", () => {
        const inputDateUser = screen.getByTestId("datepicker");
        fireEvent.change(inputDateUser, { target: { value: "2023-05-06" } });
        expect(inputDateUser.value).toBe("2023-05-06");

        const submitBtn = document.querySelector("#btn-send-bill");
        userEvent.click(submitBtn);
        expect(screen.getByTestId("form-new-bill")).toBeTruthy();
      });
    });

    describe("When I do fill the 'required' fields and I click on the submit button", () => {
      test("Then it should render the Bills page", () => {
        const inputExpenseType = screen.getByTestId("expense-type");
        fireEvent.change(inputExpenseType, { target: { value: "Transports" } });
        expect(inputExpenseType.value).toBe("Transports");

        const inputDateUser = screen.getByTestId("datepicker");
        fireEvent.change(inputDateUser, { target: { value: "2023-05-06" } });
        expect(inputDateUser.value).toBe("2023-05-06");

        const inputTVAPct = screen.getByTestId("pct");
        fireEvent.change(inputTVAPct, { target: { value: "5" } });
        expect(inputTVAPct.value).toBe("5");

        const inputTTCAmount = screen.getByTestId("amount");
        fireEvent.change(inputTTCAmount, { target: { value: "200" } });
        expect(inputTTCAmount.value).toBe("200");

        const inputSupportingDoc = screen.getByTestId("file");
        const file = new File([""], "mock.png", { type: "image/png" });
        Object.defineProperty(inputSupportingDoc, "files", {
          value: [file],
        });
        fireEvent.change(inputSupportingDoc);
        expect(inputSupportingDoc.files[0].name).toBe("mock.png");

        const submitBtn = document.querySelector("#btn-send-bill");
        userEvent.click(submitBtn);
        expect(screen.getByTestId("data-table")).toBeTruthy();
      });

      /* test("Then it should submit the form", () => {
        const inputDateUser = screen.getByTestId("datepicker");
        fireEvent.change(inputDateUser, { target: { value: "2023-05-06" } });
        expect(inputDateUser.value).toBe("2023-05-06");

        const submitBtn = document.querySelector("#btn-send-bill");
        userEvent.click(submitBtn);
        expect(screen.getByTestId("form-new-bill")).toBeTruthy();
      }); */
    });
  });
});
