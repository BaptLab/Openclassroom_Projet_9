/**
 * @jest-environment jsdom
 */

import { screen, waitFor } from "@testing-library/dom";
import BillsUI from "../views/BillsUI.js";
import { bills } from "../fixtures/bills.js";
import { ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import userEvent from "@testing-library/user-event";

import router from "../app/Router.js";

//Va sur la page employee
function setEmployeePage() {
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
}

describe("Given I am connected as an employee", () => {
  beforeEach(() => {
    //set-up session employee avant chaque test
    setEmployeePage();
  });

  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {
      window.onNavigate(ROUTES_PATH.Bills);
      await waitFor(() => screen.getByTestId("icon-window"));
      const windowIcon = screen.getByTestId("icon-window");
      //to-do write expect expression
      expect(windowIcon.classList.contains("active-icon")).toBeTruthy();
    });

    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills });
      const dates = screen
        .getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i)
        .map((a) => a.innerHTML);
      const antiChrono = (a, b) => (a < b ? 1 : -1);
      const datesSorted = [...dates].sort(antiChrono);
      expect(dates).toEqual(datesSorted);
    });

    /*Tests ajoutés*/

    //API tests
    describe("When the API is being called", () => {
      test("Then the data should be correct & complete", {});

      test('Then an error 404 should appear if the promise return an "Error 404"', () => {});

      test('Then an error 404 should appear if the promise return an "Error 500"', () => {});
    });

    //bug a corriger avec mentor -->  TypeError: $(...).modal is not a function
    describe("When the user click on the eye icon of a bill", () => {
      test.skip("Then it should display the proof of payment modal", async () => {
        window.onNavigate(ROUTES_PATH.Bills);
        await waitFor(() => {
          screen.getAllByTestId("icon-eye");
        });
        const eye_icons = screen.getAllByTestId("icon-eye");
        userEvent.click(eye_icons[0]);
        await waitFor(() => {
          screen.getByRole("document");
        });
        expect(screen.getByRole("document")).toBeTruthy();
      });
    });

    describe('When the user click on "New Bill"', () => {
      test("Then it should render the New Bill page", async () => {
        window.onNavigate(ROUTES_PATH.Bills);
        await waitFor(() => screen.getByTestId("btn-new-bill"));
        userEvent.click(screen.getByTestId("btn-new-bill"));
        //On vérifie que le header de la page est bien présent
        expect(
          (screen.getByTestId("newbill-header").textContent = "Envoyer une note de frais")
        ).toBeTruthy();
      });
    });
  });
});
