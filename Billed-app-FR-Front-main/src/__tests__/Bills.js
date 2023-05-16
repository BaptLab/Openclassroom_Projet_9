/**
 * @jest-environment jsdom
 */

import { screen, waitFor } from "@testing-library/dom";
import BillsUI from "../views/BillsUI.js";
import { bills } from "../fixtures/bills.js";
import { ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import userEvent from "@testing-library/user-event";
import mockStore from "../__mocks__/store";
import router from "../app/Router.js";

jest.mock("../app/store", () => mockStore);

//Va sur la page employee avec data mockée
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
  describe("When I am on Bills Page", () => {
    beforeEach(() => {
      jest.spyOn(mockStore, "bills");
      setEmployeePage();
    });

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

    describe("When an error occurs on API", () => {
      test("fetches bills from an API and fails with 404 message error", async () => {
        mockStore.bills.mockImplementationOnce(() => {
          return {
            list: () => {
              return Promise.reject(new Error("Erreur 404"));
            },
          };
        });
        window.onNavigate(ROUTES_PATH.Bills);
        await new Promise(process.nextTick);
        const message = await screen.getByText(/Erreur 404/);
        expect(message).toBeTruthy();
      });

      test("fetches messages from an API and fails with 500 message error", async () => {
        mockStore.bills.mockImplementationOnce(() => {
          return {
            list: () => {
              return Promise.reject(new Error("Erreur 500"));
            },
          };
        });
        window.onNavigate(ROUTES_PATH.Bills);
        await new Promise(process.nextTick);
        const message = await screen.getByText(/Erreur 500/);
        expect(message).toBeTruthy();
      });
    });

    describe("When click on eye-icon of a bill", () => {
      test("Then the proof of payment modal is being displayed", async () => {
        const modalBody = document.querySelector(".modal-body");
        expect(modalBody.innerHTML.trim() == "").toBeTruthy();
        $.fn.modal = jest.fn();
        const eye_icons = screen.getAllByTestId("icon-eye");
        userEvent.click(eye_icons[0]);
        expect(!modalBody.innerHTML.trim() == "").toBeTruthy();
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
