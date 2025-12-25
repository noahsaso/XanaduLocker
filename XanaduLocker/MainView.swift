//
//  MainSwiftUIView.swift
//  XanaduLocker
//
//  Created by Noah on 12/25/25.
//

import SwiftUI

extension UserDefaults {
    static let appStorage = UserDefaults(suiteName: "group.com.noahsaso.XanaduLocker")!
}

struct MainView: View {
    @FocusState private var isFocused: Bool
    @AppStorage("code", store: .appStorage) private var code: String = "1234"

    var body: some View {
        VStack(spacing: 64) {
            Image(.icon)
                .resizable()
                .scaledToFit()
                .frame(width: 160, height: 160)
            VStack(spacing: 32) {
                VStack(spacing: 24) {
                    Text("Set your 4-digit locker code:")
                    TextField("Code", text: $code)
                        .focused($isFocused)
                        .textFieldStyle(.plain)
                        .multilineTextAlignment(.center)
                        .frame(maxWidth: 144, alignment: .center)
                        .keyboardType(.numberPad)
                        .padding(8)
                        .overlay(RoundedRectangle(cornerRadius: 6).stroke(
                            code.count == 4 ? Color.green : Color.red,
                        ))
                        .onChange(of: code) { _ in
                            if code.count == 4 {
                                isFocused = false
                            }
                        }
                }
                HStack(spacing: 24) {
                    Button("Reset", role: .destructive) {
                        code = ""
                        isFocused = true
                    }
                    Button("Done") {
                        isFocused = false
                    }
                }
            }
        }
    }
}

#Preview {
    MainView()
}
